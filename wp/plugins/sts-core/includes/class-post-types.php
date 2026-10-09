<?php
/**
 * Content types.
 *
 * Everything the site renders as a page or a card is a post type here, so the
 * office edits it with the editor it already knows.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Post_Types {

	/** Every post type this plugin owns. */
	public static function slugs(): array {
		return array(
			'sts_vehicle',
			'sts_service',
			'sts_city',
			'sts_client',
			'sts_testimonial',
			'sts_team',
			'sts_route',
			'sts_faq',
		);
	}

	public static function init(): void {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	public static function register(): void {
		self::post_type(
			'sts_vehicle',
			__( 'Vehicles', 'sts-core' ),
			__( 'Vehicle', 'sts-core' ),
			'dashicons-car',
			array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
			'vehicles'
		);

		self::post_type(
			'sts_service',
			__( 'Services', 'sts-core' ),
			__( 'Service', 'sts-core' ),
			'dashicons-clipboard',
			array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
			'services'
		);

		self::post_type(
			'sts_city',
			__( 'Cities', 'sts-core' ),
			__( 'City', 'sts-core' ),
			'dashicons-location-alt',
			array( 'title', 'editor', 'page-attributes' ),
			'cities'
		);

		self::post_type(
			'sts_client',
			__( 'Clients', 'sts-core' ),
			__( 'Client', 'sts-core' ),
			'dashicons-building',
			array( 'title', 'thumbnail', 'page-attributes' ),
			'clients'
		);

		self::post_type(
			'sts_testimonial',
			__( 'Testimonials', 'sts-core' ),
			__( 'Testimonial', 'sts-core' ),
			'dashicons-format-quote',
			array( 'title', 'editor' ),
			'testimonials'
		);

		self::post_type(
			'sts_team',
			__( 'Team', 'sts-core' ),
			__( 'Team Member', 'sts-core' ),
			'dashicons-groups',
			array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
			'team'
		);

		self::post_type(
			'sts_route',
			__( 'Routes', 'sts-core' ),
			__( 'Route', 'sts-core' ),
			'dashicons-location',
			array( 'title' ),
			'routes'
		);

		self::post_type(
			'sts_faq',
			__( 'FAQs', 'sts-core' ),
			__( 'FAQ', 'sts-core' ),
			'dashicons-editor-help',
			array( 'title', 'editor', 'page-attributes' ),
			'faqs'
		);

		register_taxonomy(
			'sts_vehicle_class',
			array( 'sts_vehicle' ),
			array(
				'labels'            => array(
					'name'          => __( 'Vehicle classes', 'sts-core' ),
					'singular_name' => __( 'Vehicle class', 'sts-core' ),
				),
				'public'            => false,
				'show_ui'           => true,
				'show_in_rest'      => true,
				'rest_base'         => 'vehicle-classes',
				'hierarchical'      => true,
				'show_admin_column' => true,
			)
		);

		self::seed_classes();
	}

	private static function post_type(
		string $key,
		string $plural,
		string $singular,
		string $icon,
		array $supports,
		string $rest_base
	): void {
		register_post_type(
			$key,
			array(
				'labels'          => array(
					'name'               => $plural,
					'singular_name'      => $singular,
					/* translators: %s: singular post type name. */
					'add_new_item'       => sprintf( __( 'Add %s', 'sts-core' ), $singular ),
					'edit_item'          => sprintf( __( 'Edit %s', 'sts-core' ), $singular ),
					'search_items'       => sprintf( __( 'Search %s', 'sts-core' ), $plural ),
					'not_found'          => sprintf( __( 'No %s yet', 'sts-core' ), strtolower( $plural ) ),
				),
				// Nothing is served from WordPress itself; the website renders it.
				'public'          => false,
				'show_ui'         => true,
				'show_in_menu'    => 'sts-core',
				'show_in_rest'    => true,
				'rest_base'       => $rest_base,
				'menu_icon'       => $icon,
				'supports'        => $supports,
				'has_archive'     => false,
				'rewrite'         => false,
				'capability_type' => 'post',
			)
		);
	}

	/**
	 * The website's class list is fixed, so the terms are created once rather
	 * than left for someone to type differently.
	 */
	private static function seed_classes(): void {
		if ( get_option( 'sts_classes_seeded' ) ) {
			return;
		}

		$classes = array(
			'coaster'     => __( 'Coaster', 'sts-core' ),
			'van'         => __( 'Van', 'sts-core' ),
			'bus'         => __( 'Bus', 'sts-core' ),
			'sedan'       => __( 'Sedan', 'sts-core' ),
			'suv'         => __( 'SUV', 'sts-core' ),
			'luxury'      => __( 'Luxury', 'sts-core' ),
			'pickup'      => __( 'Pickup', 'sts-core' ),
			'economy'     => __( 'Economy', 'sts-core' ),
			'convertible' => __( 'Convertible', 'sts-core' ),
		);

		foreach ( $classes as $slug => $label ) {
			if ( ! term_exists( $slug, 'sts_vehicle_class' ) ) {
				wp_insert_term( $label, 'sts_vehicle_class', array( 'slug' => $slug ) );
			}
		}

		update_option( 'sts_classes_seeded', 1 );
	}
}
