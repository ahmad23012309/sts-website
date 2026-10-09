<?php
/**
 * Write endpoints.
 *
 * Two callers, authenticated two different ways:
 *
 *   the website        signs each submission with the shared secret, because
 *                      it is a server we control and the signature proves the
 *                      request came from it rather than from a browser;
 *   the management     presents an API key as a bearer token, because it is a
 *   software           separate system with its own lifecycle and its access
 *                      needs to be revocable on its own.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_REST_Write {

	const NS = 'sts/v1';

	/** How far out of step a signed request's clock may be. */
	private const MAX_SKEW = 300;

	public static function init(): void {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	public static function routes(): void {
		register_rest_route(
			self::NS,
			'/submissions',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'submit' ),
				'permission_callback' => array( __CLASS__, 'verify_signature' ),
			)
		);

		register_rest_route(
			self::NS,
			'/bookings',
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'list_bookings' ),
				'permission_callback' => array( __CLASS__, 'verify_api_key' ),
			)
		);

		register_rest_route(
			self::NS,
			'/bookings/(?P<id>\d+)',
			array(
				'methods'             => 'PATCH',
				'callback'            => array( __CLASS__, 'update_booking' ),
				'permission_callback' => array( __CLASS__, 'verify_api_key' ),
			)
		);
	}

	/**
	 * Confirms the request was signed by the website.
	 *
	 * The timestamp is part of what is signed and must be recent, so a captured
	 * request cannot be replayed later. The comparison is constant-time.
	 */
	public static function verify_signature( WP_REST_Request $request ): bool|WP_Error {
		$secret = (string) STS_Settings::value( 'integration', 'webhook_secret', '' );
		if ( '' === $secret ) {
			return new WP_Error( 'sts_not_configured', __( 'No signing secret is set.', 'sts-core' ), array( 'status' => 503 ) );
		}

		$timestamp = (string) $request->get_header( 'x_sts_timestamp' );
		$signature = (string) $request->get_header( 'x_sts_signature' );

		if ( '' === $timestamp || '' === $signature ) {
			return new WP_Error( 'sts_unsigned', __( 'Missing signature.', 'sts-core' ), array( 'status' => 401 ) );
		}

		if ( abs( time() - (int) $timestamp ) > self::MAX_SKEW ) {
			return new WP_Error( 'sts_stale', __( 'Signature has expired.', 'sts-core' ), array( 'status' => 401 ) );
		}

		$expected = hash_hmac( 'sha256', $timestamp . '.' . $request->get_body(), $secret );

		if ( ! hash_equals( $expected, $signature ) ) {
			return new WP_Error( 'sts_bad_signature', __( 'Signature does not match.', 'sts-core' ), array( 'status' => 401 ) );
		}

		return true;
	}

	public static function verify_api_key( WP_REST_Request $request ): bool|WP_Error {
		$header = (string) $request->get_header( 'authorization' );

		if ( ! str_starts_with( strtolower( $header ), 'bearer ' ) ) {
			return new WP_Error( 'sts_no_key', __( 'An API key is required.', 'sts-core' ), array( 'status' => 401 ) );
		}

		$key = STS_API_Keys::verify( trim( substr( $header, 7 ) ) );

		if ( ! $key ) {
			return new WP_Error( 'sts_bad_key', __( 'That key is not valid.', 'sts-core' ), array( 'status' => 401 ) );
		}

		return true;
	}

	public static function submit( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$body = $request->get_json_params();

		if ( ! is_array( $body ) || empty( $body['kind'] ) || ! is_array( $body['payload'] ?? null ) ) {
			return new WP_Error( 'sts_bad_request', __( 'Malformed submission.', 'sts-core' ), array( 'status' => 400 ) );
		}

		$kind = sanitize_key( (string) $body['kind'] );
		if ( ! in_array( $kind, array( 'booking', 'quick-booking', 'corporate-lead' ), true ) ) {
			return new WP_Error( 'sts_bad_kind', __( 'Unknown submission type.', 'sts-core' ), array( 'status' => 400 ) );
		}

		$reference = STS_Submissions::store( $kind, $body['payload'] );

		return new WP_REST_Response( array( 'reference' => $reference ), 201 );
	}

	public static function list_bookings( WP_REST_Request $request ): WP_REST_Response {
		return new WP_REST_Response(
			STS_Submissions::listing(
				array(
					'status' => sanitize_key( (string) $request->get_param( 'status' ) ),
					'kind'   => sanitize_key( (string) $request->get_param( 'kind' ) ),
					'limit'  => (int) $request->get_param( 'limit' ),
				)
			),
			200
		);
	}

	public static function update_booking( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$status = sanitize_key( (string) $request->get_param( 'status' ) );

		if ( ! STS_Submissions::update_status( (int) $request['id'], $status ) ) {
			return new WP_Error( 'sts_bad_status', __( 'Unknown status.', 'sts-core' ), array( 'status' => 400 ) );
		}

		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}
}
