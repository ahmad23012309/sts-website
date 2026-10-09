<?php
/**
 * Who changed which price, and when.
 *
 * A rental business priced on fuel argues about numbers. This is the record
 * that ends those arguments, so it is written automatically rather than being
 * something anyone has to remember.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Rate_Log {

	public static function init(): void {
		// These fire BEFORE the write, which is the only moment the previous
		// value is still readable.
		add_filter( 'update_post_metadata', array( __CLASS__, 'before_change' ), 10, 4 );
		add_filter( 'add_post_metadata', array( __CLASS__, 'before_change' ), 10, 4 );
	}

	public static function record( string $subject, string $field, mixed $old, mixed $new ): void {
		global $wpdb;

		$user = wp_get_current_user();

		$wpdb->insert(
			STS_Install::table( 'rate_log' ),
			array(
				'user_id'    => $user->ID ?: null,
				'user_login' => $user->user_login ?: null,
				'subject'    => $subject,
				'field'      => $field,
				'old_value'  => is_scalar( $old ) ? (string) $old : wp_json_encode( $old ),
				'new_value'  => is_scalar( $new ) ? (string) $new : wp_json_encode( $new ),
				'changed_at' => current_time( 'mysql' ),
			),
			array( '%d', '%s', '%s', '%s', '%s', '%s', '%s' )
		);
	}

	/**
	 * Rate fields are logged wherever they are edited, the admin form and the
	 * REST API alike, which is why this hangs off the metadata filters rather
	 * than off the form.
	 *
	 * Returning the unchanged $check lets WordPress carry on with the write;
	 * this only observes.
	 */
	public static function before_change( mixed $check, int $object_id, string $meta_key, mixed $meta_value ): mixed {
		if ( null !== $check || ! str_starts_with( $meta_key, 'sts_' ) ) {
			return $check;
		}

		$field  = substr( $meta_key, 4 );
		$type   = get_post_type( $object_id );
		$schema = STS_Fields::schema()[ $type ] ?? array();

		if ( empty( $schema[ $field ]['logged'] ) ) {
			return $check;
		}

		$previous = get_post_meta( $object_id, $meta_key, true );
		if ( (string) $previous === (string) $meta_value ) {
			return $check;
		}

		self::record( $type . ':' . $object_id, $field, $previous, $meta_value );

		return $check;
	}

	public static function recent( int $limit = 100 ): array {
		global $wpdb;
		$table = STS_Install::table( 'rate_log' );

		return (array) $wpdb->get_results(
			$wpdb->prepare( "SELECT * FROM {$table} ORDER BY changed_at DESC LIMIT %d", $limit )
		);
	}
}
