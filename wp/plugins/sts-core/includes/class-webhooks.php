<?php
/**
 * Outbound delivery to the management software.
 *
 * Queued rather than sent inline, so a slow or unreachable endpoint never
 * delays the visitor who just pressed the button, and a failure is retried
 * instead of lost.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Webhooks {

	/** Minutes to wait before each attempt. Running out means dead-lettered. */
	private const BACKOFF = array( 1, 5, 15, 60, 240, 720 );

	public static function init(): void {
		add_action( 'sts_drain_webhook_queue', array( __CLASS__, 'drain' ) );
	}

	public static function queue( ?int $booking_id, string $event, array $payload ): void {
		global $wpdb;

		$wpdb->insert(
			STS_Install::table( 'webhook_queue' ),
			array(
				'booking_id'      => $booking_id,
				'event'           => sanitize_key( $event ),
				'payload'         => wp_json_encode( $payload ),
				'status'          => 'pending',
				'attempts'        => 0,
				'next_attempt_at' => current_time( 'mysql' ),
				'created_at'      => current_time( 'mysql' ),
			)
		);

		// Try at once; the cron run is the safety net, not the main path.
		self::drain( 5 );
	}

	public static function drain( int $limit = 25 ): void {
		global $wpdb;

		$endpoint = (string) STS_Settings::value( 'integration', 'webhook_url', '' );
		$secret   = (string) STS_Settings::value( 'integration', 'webhook_secret', '' );

		if ( '' === $endpoint || '' === $secret ) {
			return;
		}

		$table = STS_Install::table( 'webhook_queue' );
		$rows  = (array) $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE status = 'pending' AND next_attempt_at <= %s ORDER BY id ASC LIMIT %d",
				current_time( 'mysql' ),
				$limit
			)
		);

		foreach ( $rows as $row ) {
			self::deliver( $row, $endpoint, $secret );
		}
	}

	private static function deliver( object $row, string $endpoint, string $secret ): void {
		global $wpdb;

		$payload   = json_decode( (string) $row->payload, true );
		$body      = wp_json_encode(
			array(
				'event'      => $row->event,
				'reference'  => is_array( $payload ) ? ( $payload['reference'] ?? null ) : null,
				'receivedAt' => $row->created_at,
				'payload'    => $payload,
			)
		);
		$timestamp = (string) time();
		$signature = hash_hmac( 'sha256', $timestamp . '.' . $body, $secret );

		$response = wp_remote_post(
			$endpoint,
			array(
				'timeout' => 10,
				'headers' => array(
					'Content-Type'    => 'application/json',
					'X-STS-Timestamp' => $timestamp,
					'X-STS-Signature' => $signature,
					'X-STS-Event'     => $row->event,
				),
				'body'    => $body,
			)
		);

		$attempts = (int) $row->attempts + 1;
		$code     = is_wp_error( $response ) ? 0 : (int) wp_remote_retrieve_response_code( $response );
		$note     = is_wp_error( $response ) ? $response->get_error_message() : 'HTTP ' . $code;

		$table = STS_Install::table( 'webhook_queue' );

		if ( $code >= 200 && $code < 300 ) {
			$wpdb->update(
				$table,
				array( 'status' => 'delivered', 'attempts' => $attempts, 'last_response' => $note ),
				array( 'id' => (int) $row->id ),
				array( '%s', '%d', '%s' ),
				array( '%d' )
			);
			return;
		}

		if ( $attempts >= count( self::BACKOFF ) ) {
			// Out of attempts. It stays visible in the admin so it can be
			// retried by hand rather than disappearing quietly.
			$wpdb->update(
				$table,
				array( 'status' => 'failed', 'attempts' => $attempts, 'last_response' => $note ),
				array( 'id' => (int) $row->id ),
				array( '%s', '%d', '%s' ),
				array( '%d' )
			);
			return;
		}

		$wait = self::BACKOFF[ $attempts ] ?? 720;
		$wpdb->update(
			$table,
			array(
				'attempts'        => $attempts,
				'last_response'   => $note,
				'next_attempt_at' => gmdate( 'Y-m-d H:i:s', strtotime( current_time( 'mysql' ) ) + ( $wait * 60 ) ),
			),
			array( 'id' => (int) $row->id ),
			array( '%d', '%s', '%s' ),
			array( '%d' )
		);
	}

	public static function retry( int $id ): void {
		global $wpdb;
		$wpdb->update(
			STS_Install::table( 'webhook_queue' ),
			array( 'status' => 'pending', 'attempts' => 0, 'next_attempt_at' => current_time( 'mysql' ) ),
			array( 'id' => $id ),
			array( '%s', '%d', '%s' ),
			array( '%d' )
		);
		self::drain( 5 );
	}

	public static function listing( int $limit = 50 ): array {
		global $wpdb;
		$table = STS_Install::table( 'webhook_queue' );
		return (array) $wpdb->get_results(
			$wpdb->prepare( "SELECT * FROM {$table} ORDER BY id DESC LIMIT %d", $limit )
		);
	}
}
