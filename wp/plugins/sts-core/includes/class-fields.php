<?php
/**
 * Custom fields.
 *
 * Declared as one table of schemas rather than scattered through the admin, so
 * what the website can read and what the office can edit are the same list and
 * cannot drift apart.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Fields {

	public static function init(): void {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	/**
	 * Every field, keyed by post type.
	 *
	 * type: text | textarea | number | money | checkbox | select | repeater | media
	 */
	public static function schema(): array {
		return array(
			'sts_vehicle' => array(
				'section_identity' => array( 'type' => 'section', 'label' => 'Identity' ),
				'make'             => array( 'type' => 'text', 'label' => 'Make' ),
				'model'            => array( 'type' => 'text', 'label' => 'Model' ),
				'variant'          => array( 'type' => 'text', 'label' => 'Variant' ),
				'year'             => array( 'type' => 'number', 'label' => 'Year' ),
				'units_in_fleet'   => array( 'type' => 'number', 'label' => 'How many we own' ),
				'available_for_corporate' => array( 'type' => 'checkbox', 'label' => 'Offered on contract' ),
				'is_featured'      => array( 'type' => 'checkbox', 'label' => 'Show on the homepage' ),

				'section_specs'      => array( 'type' => 'section', 'label' => 'Specifications' ),
				'engine_cc'          => array( 'type' => 'number', 'label' => 'Engine, cc' ),
				'seats'              => array( 'type' => 'number', 'label' => 'Seats' ),
				'doors'              => array( 'type' => 'number', 'label' => 'Doors' ),
				'luggage'            => array( 'type' => 'number', 'label' => 'Luggage, bags' ),
				'transmission'       => array( 'type' => 'select', 'label' => 'Transmission', 'options' => array( 'automatic', 'manual' ) ),
				'fuel_type'          => array( 'type' => 'select', 'label' => 'Fuel', 'options' => array( 'petrol', 'diesel', 'hybrid', 'electric' ) ),
				'mileage_city'       => array( 'type' => 'number', 'label' => 'Consumption, city km/l', 'step' => '0.1' ),
				'mileage_highway'    => array( 'type' => 'number', 'label' => 'Consumption, highway km/l', 'step' => '0.1' ),
				'air_conditioning'   => array( 'type' => 'checkbox', 'label' => 'Air conditioning' ),

				'section_rates'        => array( 'type' => 'section', 'label' => 'Rates', 'logged' => true ),
				'rate_with_fuel'       => array( 'type' => 'money', 'label' => 'Within city, with fuel, per day', 'logged' => true ),
				'rate_without_fuel'    => array( 'type' => 'money', 'label' => 'Within city, without fuel, per day', 'logged' => true ),
				'rate_out_of_city'     => array( 'type' => 'money', 'label' => 'Out of station, per day', 'logged' => true ),
				'rate_per_km'          => array( 'type' => 'money', 'label' => 'Per kilometre', 'logged' => true ),
				'overtime_per_hour'    => array( 'type' => 'money', 'label' => 'Overtime, per hour', 'logged' => true ),
				'driver_allowance'     => array( 'type' => 'money', 'label' => 'Driver allowance, per day', 'logged' => true ),
				'night_stay_charge'    => array( 'type' => 'money', 'label' => 'Night stay', 'logged' => true ),
				'security_deposit'     => array( 'type' => 'money', 'label' => 'Security deposit', 'logged' => true ),

				'section_media'   => array( 'type' => 'section', 'label' => 'Media and 3D' ),
				'gallery'         => array( 'type' => 'media', 'label' => 'Photographs' ),
				'colors'          => array( 'type' => 'repeater', 'label' => 'Colours', 'fields' => array( 'name', 'hex' ) ),
				'features'        => array( 'type' => 'textarea', 'label' => 'Features, one per line' ),
				'sketchfab_uid'   => array( 'type' => 'text', 'label' => 'Sketchfab model id' ),
				'sketchfab_title' => array( 'type' => 'text', 'label' => 'Sketchfab model title' ),
				'sketchfab_author'=> array( 'type' => 'text', 'label' => 'Sketchfab author' ),
				'sketchfab_license' => array( 'type' => 'text', 'label' => 'Sketchfab licence' ),
				'model_accuracy'  => array( 'type' => 'select', 'label' => '3D accuracy', 'options' => array( 'representative', 'exact' ) ),

				'section_seo'     => array( 'type' => 'section', 'label' => 'Search' ),
				'seo_title'       => array( 'type' => 'text', 'label' => 'Page title' ),
				'seo_description' => array( 'type' => 'textarea', 'label' => 'Meta description' ),
			),

			'sts_service' => array(
				'audience'           => array( 'type' => 'text', 'label' => 'Who it is for' ),
				'summary'            => array( 'type' => 'textarea', 'label' => 'One-line summary' ),
				'points'             => array( 'type' => 'textarea', 'label' => 'Bullet points, one per line' ),
				'related_classes'    => array( 'type' => 'text', 'label' => 'Vehicle classes, comma separated' ),
				'seo_title'          => array( 'type' => 'text', 'label' => 'Page title' ),
				'seo_description'    => array( 'type' => 'textarea', 'label' => 'Meta description' ),
			),

			'sts_city' => array(
				'is_base'         => array( 'type' => 'checkbox', 'label' => 'This is our base' ),
				'intro'           => array( 'type' => 'textarea', 'label' => 'Introduction' ),
				'uses'            => array( 'type' => 'textarea', 'label' => 'What people hire for, one per line' ),
				'areas'           => array( 'type' => 'textarea', 'label' => 'Areas we cover, one per line' ),
				'airport'         => array( 'type' => 'text', 'label' => 'Airport' ),
				'seo_title'       => array( 'type' => 'text', 'label' => 'Page title' ),
				'seo_description' => array( 'type' => 'textarea', 'label' => 'Meta description' ),
			),

			'sts_client' => array(
				'show_logo'         => array( 'type' => 'checkbox', 'label' => 'Show the logo on the site' ),
				'permission_on_file'=> array( 'type' => 'checkbox', 'label' => 'Written permission held' ),
				'industry'          => array( 'type' => 'text', 'label' => 'Industry' ),
			),

			'sts_testimonial' => array(
				'author_name' => array( 'type' => 'text', 'label' => 'Name' ),
				'company'     => array( 'type' => 'text', 'label' => 'Company' ),
				'rating'      => array( 'type' => 'number', 'label' => 'Rating out of five' ),
				'source'      => array( 'type' => 'text', 'label' => 'Where it came from' ),
				'verified'    => array( 'type' => 'checkbox', 'label' => 'Verified as genuine' ),
			),

			'sts_team' => array(
				'role' => array( 'type' => 'text', 'label' => 'Role' ),
			),

			'sts_route' => array(
				'origin'          => array( 'type' => 'text', 'label' => 'From' ),
				'destination'     => array( 'type' => 'text', 'label' => 'To' ),
				'distance_km'     => array( 'type' => 'number', 'label' => 'Distance, km', 'logged' => true ),
				'estimated_hours' => array( 'type' => 'number', 'label' => 'Typical hours', 'step' => '0.1' ),
				'toll_charges'    => array( 'type' => 'money', 'label' => 'Tolls', 'logged' => true ),
			),

			'sts_faq' => array(
				'topic' => array( 'type' => 'text', 'label' => 'Topic' ),
			),
		);
	}

	public static function register(): void {
		foreach ( self::schema() as $post_type => $fields ) {
			foreach ( $fields as $key => $field ) {
				if ( 'section' === $field['type'] ) {
					continue;
				}

				register_post_meta(
					$post_type,
					'sts_' . $key,
					array(
						'type'              => self::rest_type( $field['type'] ),
						'single'            => true,
						'show_in_rest'      => 'repeater' === $field['type'] || 'media' === $field['type']
							? array( 'schema' => array( 'type' => 'string' ) )
							: true,
						'sanitize_callback' => self::sanitizer( $field['type'] ),
						'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
					)
				);
			}
		}
	}

	private static function rest_type( string $type ): string {
		return match ( $type ) {
			'number', 'money' => 'number',
			'checkbox'        => 'boolean',
			default           => 'string',
		};
	}

	/**
	 * Returns a sanitiser for the field type. Everything that reaches the
	 * database passes through one of these.
	 */
	public static function sanitizer( string $type ): callable {
		return match ( $type ) {
			'number', 'money' => static fn( $value ): float => (float) $value,
			'checkbox'        => static fn( $value ): bool => (bool) $value,
			'textarea', 'repeater', 'media' => static fn( $value ): string => sanitize_textarea_field( (string) $value ),
			default           => static fn( $value ): string => sanitize_text_field( (string) $value ),
		};
	}
}
