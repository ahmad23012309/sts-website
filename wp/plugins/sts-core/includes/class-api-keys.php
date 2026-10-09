<?php
/**
 * API keys for the management software.
 *
 * A key is shown once, at creation, and never again, the way a bank shows a
 * card number once. What is stored is a hash, so a copy of the database does
 * not hand anyone a working key.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_API_Keys {

	/**
	 * Issues a key and returns the plain token. This is the only moment the
	 * plain token exists; it is not stored anywhere.
	 */
	public static function issue( string $label, string $scopes = 'read' ): string {
		global $wpdb;

		$prefix = substr( bin2hex( random_bytes( 6 ) ), 0, 10 );
		$secret = bin2hex( random_bytes( 24 ) );
		$token  = 'sts_' . $prefix . '_' . $secret;

		$wpdb->insert(
			STS_Install::table( 'api_keys' ),
			array(
				'label'      => sanitize_text_field( $label ),
				'prefix'     => $prefix,
				'token_hash' => self::hash( $token ),
				'scopes'     => sanitize_text_field( $scopes ),
				'created_at' => current_time( 'mysql' ),
			),
			array( '%s', '%s', '%s', '%s', '%s' )
		);

		return $token;
	}

	public static function revoke( int $id ): void {
		global $wpdb;
		$wpdb->update(
			STS_Install::table( 'api_keys' ),
			array( 'revoked_at' => current_time( 'mysql' ) ),
			array( 'id' => $id ),
			array( '%s' ),
			array( '%d' )
		);
	}

	public static function all(): array {
		global $wpdb;
		$table = STS_Install::table( 'api_keys' );
		return (array) $wpdb->get_results( "SELECT * FROM {$table} ORDER BY created_at DESC" );
	}

	/**
	 * Verifies a presented token. Returns the key row, or null.
	 *
	 * The prefix narrows it to one row so this stays a single indexed lookup,
	 * and the comparison itself is constant-time.
	 */
	public static function verify( string $token ): ?object {
		global $wpdb;

		if ( ! str_starts_with( $token, 'sts_' ) ) {
			return null;
		}

		$parts = explode( '_', $token );
		if ( count( $parts ) !== 3 ) {
			return null;
		}

		$table = STS_Install::table( 'api_keys' );
		$row   = $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$table} WHERE prefix = %s AND revoked_at IS NULL", $parts[1] )
		);

		if ( ! $row || ! hash_equals( (string) $row->token_hash, self::hash( $token ) ) ) {
			return null;
		}

		$wpdb->update(
			$table,
			array( 'last_used_at' => current_time( 'mysql' ) ),
			array( 'id' => (int) $row->id ),
			array( '%s' ),
			array( '%d' )
		);

		return $row;
	}

	private static function hash( string $token ): string {
		return hash_hmac( 'sha256', $token, wp_salt( 'secure_auth' ) );
	}
}
