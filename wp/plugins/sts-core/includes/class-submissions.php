<?php
/**
 * Bookings and leads.
 *
 * Stored here first, then queued for the management software. That order
 * matters: a booking is never lost because the software was down, and the
 * office has the record before the software does.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Submissions {

	public const STATUSES = array( 'new', 'contacted', 'confirmed', 'completed', 'cancelled' );

	/**
	 * Writes a submission and queues it for delivery. Returns the reference.
	 */
	public static function store( string $kind, array $payload ): string {
		global $wpdb;

		$reference = self::reference();
		$now       = current_time( 'mysql' );

		$wpdb->insert(
			STS_Install::table( 'bookings' ),
			array(
				'reference'        => $reference,
				'kind'             => sanitize_key( $kind ),
				'status'           => 'new',
				'customer_name'    => sanitize_text_field( (string) ( $payload['name'] ?? $payload['contactName'] ?? '' ) ),
				'phone'            => sanitize_text_field( (string) ( $payload['phone'] ?? '' ) ),
				'email'            => sanitize_email( (string) ( $payload['email'] ?? '' ) ) ?: null,
				'company'          => sanitize_text_field( (string) ( $payload['companyName'] ?? '' ) ) ?: null,
				'vehicle_slug'     => sanitize_text_field( (string) ( $payload['vehicleSlug'] ?? '' ) ) ?: null,
				'vehicle_category' => sanitize_text_field( (string) ( $payload['vehicleCategory'] ?? '' ) ) ?: null,
				'pickup_date'      => self::date( $payload['pickupDate'] ?? null ),
				'dropoff_date'     => self::date( $payload['dropoffDate'] ?? null ),
				'city'             => sanitize_text_field( (string) ( $payload['city'] ?? '' ) ) ?: null,
				'pickup_location'  => sanitize_text_field( (string) ( $payload['pickupLocation'] ?? '' ) ) ?: null,
				'dropoff_location' => sanitize_text_field( (string) ( $payload['dropoffLocation'] ?? '' ) ) ?: null,
				'with_fuel'        => ! empty( $payload['withFuel'] ) ? 1 : 0,
				'with_driver'      => ! empty( $payload['withDriver'] ) ? 1 : 0,
				'estimated_total'  => isset( $payload['estimatedTotal'] ) ? (float) $payload['estimatedTotal'] : null,
				'notes'            => sanitize_textarea_field( (string) ( $payload['notes'] ?? $payload['requirements'] ?? '' ) ) ?: null,
				'payload'          => wp_json_encode( $payload ),
				'source'           => 'website',
				'created_at'       => $now,
				'updated_at'       => $now,
			)
		);

		$booking_id = (int) $wpdb->insert_id;

		STS_Webhooks::queue( $booking_id, 'booking.created', array_merge( $payload, array( 'reference' => $reference, 'kind' => $kind ) ) );
		self::notify( $kind, $reference, $payload );

		return $reference;
	}

	public static function update_status( int $id, string $status ): bool {
		global $wpdb;

		if ( ! in_array( $status, self::STATUSES, true ) ) {
			return false;
		}

		return (bool) $wpdb->update(
			STS_Install::table( 'bookings' ),
			array( 'status' => $status, 'updated_at' => current_time( 'mysql' ) ),
			array( 'id' => $id ),
			array( '%s', '%s' ),
			array( '%d' )
		);
	}

	public static function listing( array $args = array() ): array {
		global $wpdb;

		$table  = STS_Install::table( 'bookings' );
		$where  = array( '1=1' );
		$params = array();

		if ( ! empty( $args['status'] ) ) {
			$where[]  = 'status = %s';
			$params[] = $args['status'];
		}
		if ( ! empty( $args['kind'] ) ) {
			$where[]  = 'kind = %s';
			$params[] = $args['kind'];
		}

		$limit    = max( 1, min( 200, (int) ( $args['limit'] ?? 50 ) ) );
		$params[] = $limit;

		$sql = 'SELECT * FROM ' . $table . ' WHERE ' . implode( ' AND ', $where ) . ' ORDER BY created_at DESC LIMIT %d';

		return (array) $wpdb->get_results( $wpdb->prepare( $sql, ...$params ) );
	}

	private static function reference(): string {
		return 'STS-' . gmdate( 'ymd' ) . '-' . strtoupper( substr( bin2hex( random_bytes( 3 ) ), 0, 5 ) );
	}

	private static function date( mixed $value ): ?string {
		$value = (string) $value;
		return preg_match( '/^\d{4}-\d{2}-\d{2}$/', $value ) ? $value : null;
	}

	/**
	 * Tells the office a booking has arrived. Email only; a WhatsApp alert
	 * needs a provider account, and the field is there for when there is one.
	 */
	private static function notify( string $kind, string $reference, array $payload ): void {
		$recipients = array_filter(
			array_map( 'trim', explode( "\n", (string) STS_Settings::value( 'integration', 'notify_emails', '' ) ) )
		);

		if ( empty( $recipients ) ) {
			return;
		}

		$lines = array( 'Reference: ' . $reference, 'Type: ' . $kind, '' );
		foreach ( $payload as $key => $value ) {
			if ( is_scalar( $value ) ) {
				$lines[] = $key . ': ' . $value;
			}
		}

		wp_mail(
			$recipients,
			sprintf( '[%s] New %s — %s', get_bloginfo( 'name' ), $kind, $reference ),
			implode( "\n", $lines )
		);
	}
}
