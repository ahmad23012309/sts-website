<?php
/**
 * Site-wide settings.
 *
 * Grouped the way the office thinks about them rather than the way the code
 * uses them, and every group is readable by the website through one endpoint.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Settings {

	const OPTION_PREFIX = 'sts_settings_';

	public static function init(): void {
		add_action( 'admin_init', array( __CLASS__, 'register' ) );
	}

	/**
	 * Every settings group. `logged` marks a field whose changes are written to
	 * the rate log, because in a business priced on fuel the record of who
	 * changed a number and when is what settles a dispute.
	 */
	public static function groups(): array {
		return array(
			'contact' => array(
				'label'  => __( 'Contact', 'sts-core' ),
				'fields' => array(
					'phone'              => array( 'label' => 'Primary phone', 'type' => 'text' ),
					'phone_alt'          => array( 'label' => 'Second phone', 'type' => 'text' ),
					'whatsapp'           => array( 'label' => 'WhatsApp, retail', 'type' => 'text' ),
					'whatsapp_corporate' => array( 'label' => 'WhatsApp, corporate', 'type' => 'text' ),
					'email'              => array( 'label' => 'Email', 'type' => 'email' ),
					'email_corporate'    => array( 'label' => 'Email, corporate', 'type' => 'email' ),
					'address_line'       => array( 'label' => 'Street address', 'type' => 'text' ),
					'city'               => array( 'label' => 'City', 'type' => 'text' ),
					'map_query'          => array( 'label' => 'What the footer map searches for', 'type' => 'text' ),
					'google_business_url'=> array( 'label' => 'Google Business profile', 'type' => 'url' ),
					'google_reviews_url' => array( 'label' => 'Google reviews link', 'type' => 'url' ),
					'public_site_url'    => array( 'label' => 'The public website, for redirecting stray visitors', 'type' => 'url' ),
				),
			),

			'hours' => array(
				'label'  => __( 'Opening hours', 'sts-core' ),
				'fields' => array(
					'always_open' => array( 'label' => 'Open 24 hours, every day', 'type' => 'checkbox' ),
					'weekdays'    => array( 'label' => 'Monday to Friday', 'type' => 'text' ),
					'saturday'    => array( 'label' => 'Saturday', 'type' => 'text' ),
					'sunday'      => array( 'label' => 'Sunday', 'type' => 'text' ),
					'holidays'    => array( 'label' => 'Holiday note', 'type' => 'textarea' ),
				),
			),

			'social' => array(
				'label'  => __( 'Social links', 'sts-core' ),
				'fields' => array(
					'facebook'  => array( 'label' => 'Facebook', 'type' => 'url' ),
					'instagram' => array( 'label' => 'Instagram', 'type' => 'url' ),
					'youtube'   => array( 'label' => 'YouTube', 'type' => 'url' ),
					'tiktok'    => array( 'label' => 'TikTok', 'type' => 'url' ),
					'linkedin'  => array( 'label' => 'LinkedIn', 'type' => 'url' ),
					'twitter'   => array( 'label' => 'X', 'type' => 'url' ),
				),
			),

			'fuel' => array(
				'label'  => __( 'Fuel rates', 'sts-core' ),
				'fields' => array(
					'petrol'         => array( 'label' => 'Petrol, per litre', 'type' => 'number', 'logged' => true ),
					'diesel'         => array( 'label' => 'Diesel, per litre', 'type' => 'number', 'logged' => true ),
					'hi_octane'      => array( 'label' => 'Hi-octane, per litre', 'type' => 'number', 'logged' => true ),
					'effective_from' => array( 'label' => 'Effective from', 'type' => 'date', 'logged' => true ),
					'note'           => array( 'label' => 'Note shown under the rates', 'type' => 'text' ),
				),
			),

			'pricing' => array(
				'label'  => __( 'Pricing rules', 'sts-core' ),
				'fields' => array(
					'margin_percent'        => array( 'label' => 'Service charge, percent', 'type' => 'number', 'logged' => true ),
					'included_km_per_day'   => array( 'label' => 'Kilometres included per day', 'type' => 'number', 'logged' => true ),
					'round_to_nearest'      => array( 'label' => 'Round totals to the nearest', 'type' => 'number' ),
					'charge_return_leg_fuel'=> array( 'label' => 'Charge fuel for the return leg on a one-way trip', 'type' => 'checkbox', 'logged' => true ),
					'without_fuel_adjust'   => array( 'label' => 'Adjust every without-fuel rate by percent', 'type' => 'number', 'logged' => true ),
					'discount_7'            => array( 'label' => 'Discount from 7 days, percent', 'type' => 'number', 'logged' => true ),
					'discount_14'           => array( 'label' => 'Discount from 14 days, percent', 'type' => 'number', 'logged' => true ),
					'discount_30'           => array( 'label' => 'Discount from 30 days, percent', 'type' => 'number', 'logged' => true ),
				),
			),

			'payments' => array(
				'label'  => __( 'Payments', 'sts-core' ),
				'fields' => array(
					'advance_percent'       => array( 'label' => 'Advance to confirm a booking, percent', 'type' => 'number' ),
					'corporate_credit_days' => array( 'label' => 'Corporate credit terms, days', 'type' => 'number' ),
					'methods'               => array( 'label' => 'Accepted methods, one per line', 'type' => 'textarea' ),
					'bank_details'          => array( 'label' => 'Bank details to publish', 'type' => 'textarea' ),
					'tax_note'              => array( 'label' => 'Tax or levy note', 'type' => 'text' ),
				),
			),

			'terms' => array(
				'label'  => __( 'What the rate covers', 'sts-core' ),
				'fields' => array(
					'included'     => array( 'label' => 'Included, one per line', 'type' => 'textarea' ),
					'excluded'     => array( 'label' => 'Not included, one per line', 'type' => 'textarea' ),
					'insurance'    => array( 'label' => 'Insurance cover, as published', 'type' => 'textarea' ),
					'legal_reviewed' => array( 'label' => 'Policy pages reviewed and approved', 'type' => 'checkbox' ),
				),
			),

			'offer' => array(
				'label'  => __( 'Offer', 'sts-core' ),
				'fields' => array(
					'enabled'  => array( 'label' => 'Show the offer', 'type' => 'checkbox' ),
					'headline' => array( 'label' => 'Headline', 'type' => 'text' ),
					'body'     => array( 'label' => 'Body', 'type' => 'textarea' ),
					'code'     => array( 'label' => 'Code', 'type' => 'text' ),
					'terms'    => array( 'label' => 'Terms', 'type' => 'textarea' ),
					'repeat_after_days' => array( 'label' => 'Show again after, days', 'type' => 'number' ),
				),
			),

			'claims' => array(
				'label'  => __( 'Announcement bar', 'sts-core' ),
				'fields' => array(
					'years_in_service' => array( 'label' => 'Years in service', 'type' => 'text' ),
					'clients_served'   => array( 'label' => 'Clients served', 'type' => 'text' ),
					'on_time_rate'     => array( 'label' => 'On-time record', 'type' => 'text' ),
				),
			),

			'integration' => array(
				'label'  => __( 'Management software', 'sts-core' ),
				'fields' => array(
					'webhook_url'      => array( 'label' => 'Where bookings are delivered', 'type' => 'url' ),
					'webhook_secret'   => array( 'label' => 'Signing secret', 'type' => 'password' ),
					'notify_emails'    => array( 'label' => 'Email a new booking to, one per line', 'type' => 'textarea' ),
					'notify_whatsapp'  => array( 'label' => 'WhatsApp number for alerts', 'type' => 'text' ),
				),
			),
		);
	}

	public static function register(): void {
		foreach ( self::groups() as $group => $config ) {
			register_setting(
				'sts_settings_' . $group,
				self::OPTION_PREFIX . $group,
				array(
					'type'              => 'object',
					'sanitize_callback' => static fn( $value ) => self::sanitize_group( $group, $value ),
					'default'           => array(),
					'show_in_rest'      => false,
				)
			);
		}
	}

	public static function get( string $group ): array {
		$value = get_option( self::OPTION_PREFIX . $group, array() );
		return is_array( $value ) ? $value : array();
	}

	public static function value( string $group, string $key, mixed $fallback = '' ): mixed {
		$values = self::get( $group );
		return $values[ $key ] ?? $fallback;
	}

	/**
	 * Sanitises a whole group and records any change to a logged field.
	 */
	public static function sanitize_group( string $group, mixed $input ): array {
		$groups = self::groups();
		if ( ! isset( $groups[ $group ] ) || ! is_array( $input ) ) {
			return array();
		}

		$previous = self::get( $group );
		$clean    = array();

		foreach ( $groups[ $group ]['fields'] as $key => $field ) {
			$raw = $input[ $key ] ?? '';

			$clean[ $key ] = match ( $field['type'] ) {
				'checkbox' => ! empty( $raw ),
				'number'   => (float) $raw,
				'email'    => sanitize_email( (string) $raw ),
				'url'      => esc_url_raw( (string) $raw ),
				'textarea', 'password' => sanitize_textarea_field( (string) $raw ),
				default    => sanitize_text_field( (string) $raw ),
			};

			$was = $previous[ $key ] ?? null;
			if ( ! empty( $field['logged'] ) && (string) $was !== (string) $clean[ $key ] ) {
				STS_Rate_Log::record( $group, $key, $was, $clean[ $key ] );
			}
		}

		if ( 'fuel' === $group ) {
			STS_Settings::append_fuel_history( $clean );
		}

		return $clean;
	}

	/**
	 * Every fuel revision is kept, because the fuel prices page is built from
	 * the history and a rate that was overwritten cannot be recovered.
	 */
	public static function append_fuel_history( array $values ): void {
		global $wpdb;

		$date = $values['effective_from'] ?? '';
		if ( '' === $date ) {
			return;
		}

		$table = STS_Install::table( 'fuel_history' );
		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO {$table} (effective_from, petrol, diesel, hi_octane, note, created_at)
				 VALUES (%s, %f, %f, %f, %s, %s)
				 ON DUPLICATE KEY UPDATE petrol = VALUES(petrol), diesel = VALUES(diesel),
				 hi_octane = VALUES(hi_octane), note = VALUES(note)",
				$date,
				(float) ( $values['petrol'] ?? 0 ),
				(float) ( $values['diesel'] ?? 0 ),
				(float) ( $values['hi_octane'] ?? 0 ),
				(string) ( $values['note'] ?? '' ),
				current_time( 'mysql' )
			)
		);
	}
}
