<?php
/**
 * Public read endpoints.
 *
 * The website reads everything it renders from here. The shapes match the
 * TypeScript types in apps/web/src/lib/cms/types.ts, so connecting the site is
 * a change to the adapter and nothing else.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_REST_Read {

	const NS = 'sts/v1';

	public static function init(): void {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	public static function routes(): void {
		$public = array( 'permission_callback' => '__return_true', 'methods' => 'GET' );

		register_rest_route( self::NS, '/settings', $public + array( 'callback' => array( __CLASS__, 'settings' ) ) );
		register_rest_route( self::NS, '/pricing', $public + array( 'callback' => array( __CLASS__, 'pricing' ) ) );
		register_rest_route( self::NS, '/fuel', $public + array( 'callback' => array( __CLASS__, 'fuel' ) ) );
		register_rest_route( self::NS, '/vehicles', $public + array( 'callback' => array( __CLASS__, 'vehicles' ) ) );
		register_rest_route( self::NS, '/vehicles/(?P<slug>[a-z0-9-]+)', $public + array( 'callback' => array( __CLASS__, 'vehicle' ) ) );
		register_rest_route( self::NS, '/routes', $public + array( 'callback' => array( __CLASS__, 'routes_list' ) ) );
		register_rest_route( self::NS, '/services', $public + array( 'callback' => array( __CLASS__, 'services' ) ) );
		register_rest_route( self::NS, '/cities', $public + array( 'callback' => array( __CLASS__, 'cities' ) ) );
		register_rest_route( self::NS, '/clients', $public + array( 'callback' => array( __CLASS__, 'clients' ) ) );
		register_rest_route( self::NS, '/testimonials', $public + array( 'callback' => array( __CLASS__, 'testimonials' ) ) );
		register_rest_route( self::NS, '/team', $public + array( 'callback' => array( __CLASS__, 'team' ) ) );
		register_rest_route( self::NS, '/faqs', $public + array( 'callback' => array( __CLASS__, 'faqs' ) ) );
		register_rest_route( self::NS, '/availability/(?P<id>\d+)', $public + array( 'callback' => array( __CLASS__, 'availability' ) ) );
	}

	public static function settings(): WP_REST_Response {
		return self::cached(
			array(
				'contact' => STS_Settings::get( 'contact' ),
				'hours'   => STS_Settings::get( 'hours' ),
				'social'  => array_filter( STS_Settings::get( 'social' ) ),
				'offer'   => STS_Settings::get( 'offer' ),
				'claims'  => STS_Settings::get( 'claims' ),
				'terms'   => array(
					'included'      => self::lines( STS_Settings::value( 'terms', 'included', '' ) ),
					'excluded'      => self::lines( STS_Settings::value( 'terms', 'excluded', '' ) ),
					'insurance'     => STS_Settings::value( 'terms', 'insurance', '' ),
					'legalReviewed' => (bool) STS_Settings::value( 'terms', 'legal_reviewed', false ),
				),
				'payments' => array(
					'advancePercent'      => (float) STS_Settings::value( 'payments', 'advance_percent', 50 ),
					'corporateCreditDays' => (int) STS_Settings::value( 'payments', 'corporate_credit_days', 30 ),
					'methods'             => self::lines( STS_Settings::value( 'payments', 'methods', '' ) ),
					'bankDetails'         => STS_Settings::value( 'payments', 'bank_details', '' ),
					'taxNote'             => STS_Settings::value( 'payments', 'tax_note', '' ),
				),
			)
		);
	}

	public static function pricing(): WP_REST_Response {
		return self::cached(
			array(
				'marginPercent'            => (float) STS_Settings::value( 'pricing', 'margin_percent', 10 ),
				'includedKmPerDay'         => (float) STS_Settings::value( 'pricing', 'included_km_per_day', 100 ),
				'roundToNearest'           => (float) STS_Settings::value( 'pricing', 'round_to_nearest', 100 ),
				'chargeReturnLegFuel'      => (bool) STS_Settings::value( 'pricing', 'charge_return_leg_fuel', true ),
				'withoutFuelAdjustPercent' => (float) STS_Settings::value( 'pricing', 'without_fuel_adjust', 0 ),
				'longStayDiscounts'        => array(
					array( 'minDays' => 30, 'percent' => (float) STS_Settings::value( 'pricing', 'discount_30', 20 ) ),
					array( 'minDays' => 14, 'percent' => (float) STS_Settings::value( 'pricing', 'discount_14', 15 ) ),
					array( 'minDays' => 7, 'percent' => (float) STS_Settings::value( 'pricing', 'discount_7', 10 ) ),
				),
			)
		);
	}

	public static function fuel(): WP_REST_Response {
		global $wpdb;
		$table = STS_Install::table( 'fuel_history' );

		$history = (array) $wpdb->get_results( "SELECT * FROM {$table} ORDER BY effective_from DESC LIMIT 60" );

		return self::cached(
			array(
				'current' => array(
					'petrol'        => (float) STS_Settings::value( 'fuel', 'petrol', 0 ),
					'diesel'        => (float) STS_Settings::value( 'fuel', 'diesel', 0 ),
					'hiOctane'      => (float) STS_Settings::value( 'fuel', 'hi_octane', 0 ),
					'effectiveFrom' => (string) STS_Settings::value( 'fuel', 'effective_from', '' ),
					'note'          => (string) STS_Settings::value( 'fuel', 'note', '' ),
				),
				'history' => array_map(
					static fn( $row ): array => array(
						'effectiveFrom' => $row->effective_from,
						'petrol'        => (float) $row->petrol,
						'diesel'        => null === $row->diesel ? null : (float) $row->diesel,
						'hiOctane'      => null === $row->hi_octane ? null : (float) $row->hi_octane,
					),
					$history
				),
			)
		);
	}

	public static function vehicles(): WP_REST_Response {
		$posts = get_posts(
			array(
				'post_type'      => 'sts_vehicle',
				'post_status'    => 'publish',
				'numberposts'    => 200,
				'orderby'        => 'menu_order title',
				'order'          => 'ASC',
			)
		);

		return self::cached( array_map( array( __CLASS__, 'serialise_vehicle' ), $posts ) );
	}

	public static function vehicle( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$posts = get_posts(
			array(
				'post_type'   => 'sts_vehicle',
				'post_status' => 'publish',
				'name'        => sanitize_title( (string) $request['slug'] ),
				'numberposts' => 1,
			)
		);

		if ( empty( $posts ) ) {
			return new WP_Error( 'sts_not_found', __( 'No such vehicle.', 'sts-core' ), array( 'status' => 404 ) );
		}

		return self::cached( self::serialise_vehicle( $posts[0] ) );
	}

	public static function serialise_vehicle( WP_Post $post ): array {
		$meta  = static fn( string $key, mixed $fallback = '' ): mixed => get_post_meta( $post->ID, 'sts_' . $key, true ) ?: $fallback;
		$terms = wp_get_post_terms( $post->ID, 'sts_vehicle_class', array( 'fields' => 'slugs' ) );

		$gallery = array_filter( array_map( 'intval', explode( ',', (string) $meta( 'gallery' ) ) ) );
		$images  = array();
		foreach ( $gallery as $attachment_id ) {
			$src = wp_get_attachment_image_src( $attachment_id, 'full' );
			if ( $src ) {
				$images[] = array(
					'src'    => $src[0],
					'width'  => $src[1],
					'height' => $src[2],
					'alt'    => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) ?: $post->post_title,
				);
			}
		}

		$uid = (string) $meta( 'sketchfab_uid' );

		return array(
			'id'           => 'v-' . $post->ID,
			'slug'         => $post->post_name,
			'make'         => (string) $meta( 'make' ),
			'model'        => (string) $meta( 'model' ),
			'variant'      => (string) $meta( 'variant' ),
			'year'         => (int) $meta( 'year', 0 ),
			'category'     => $terms[0] ?? 'sedan',
			'unitsInFleet' => (int) $meta( 'units_in_fleet', 1 ),
			'specs'        => array(
				'engineCc'          => (int) $meta( 'engine_cc', 0 ),
				'seats'             => (int) $meta( 'seats', 0 ),
				'doors'             => (int) $meta( 'doors', 0 ),
				'luggage'           => (int) $meta( 'luggage', 0 ),
				'transmission'      => (string) $meta( 'transmission', 'manual' ),
				'fuelType'          => (string) $meta( 'fuel_type', 'petrol' ),
				'mileageCityKmpl'   => (float) $meta( 'mileage_city', 0 ),
				'mileageHighwayKmpl'=> (float) $meta( 'mileage_highway', 0 ),
				'airConditioning'   => (bool) $meta( 'air_conditioning', false ),
			),
			'rates'        => array(
				'withFuelDaily'    => (float) $meta( 'rate_with_fuel', 0 ),
				'withoutFuelDaily' => (float) $meta( 'rate_without_fuel', 0 ),
				'outOfCityDaily'   => (float) $meta( 'rate_out_of_city', 0 ),
				'perKm'            => (float) $meta( 'rate_per_km', 0 ),
				'overtimePerHour'  => (float) $meta( 'overtime_per_hour', 0 ),
				'driverAllowance'  => (float) $meta( 'driver_allowance', 0 ),
				'nightStayCharge'  => (float) $meta( 'night_stay_charge', 0 ),
				'securityDeposit'  => (float) $meta( 'security_deposit', 0 ),
			),
			'colors'       => self::pairs( (string) $meta( 'colors' ) ),
			'images'       => $images,
			'features'     => self::lines( (string) $meta( 'features' ) ),
			'model3d'      => '' === $uid ? null : array(
				'uid'        => $uid,
				'title'      => (string) $meta( 'sketchfab_title', $post->post_title ),
				'modelUrl'   => 'https://sketchfab.com/3d-models/' . $uid,
				'authorName' => ( (string) $meta( 'sketchfab_author' ) ) ?: null,
				'authorUrl'  => null,
				'license'    => ( (string) $meta( 'sketchfab_license' ) ) ?: null,
				'accuracy'   => (string) $meta( 'model_accuracy', 'representative' ),
			),
			'availableForCorporate' => (bool) $meta( 'available_for_corporate', false ),
			'isFeatured'   => (bool) $meta( 'is_featured', false ),
			'seo'          => array(
				'title'       => (string) $meta( 'seo_title' ),
				'description' => (string) $meta( 'seo_description' ),
			),
		);
	}

	public static function routes_list(): WP_REST_Response {
		$posts = get_posts( array( 'post_type' => 'sts_route', 'post_status' => 'publish', 'numberposts' => 300 ) );

		return self::cached(
			array_map(
				static fn( WP_Post $post ): array => array(
					'origin'         => (string) get_post_meta( $post->ID, 'sts_origin', true ),
					'destination'    => (string) get_post_meta( $post->ID, 'sts_destination', true ),
					'distanceKm'     => (float) get_post_meta( $post->ID, 'sts_distance_km', true ),
					'estimatedHours' => (float) get_post_meta( $post->ID, 'sts_estimated_hours', true ),
					'tollCharges'    => (float) get_post_meta( $post->ID, 'sts_toll_charges', true ),
				),
				$posts
			)
		);
	}

	public static function services(): WP_REST_Response {
		return self::cached( self::simple( 'sts_service', array( 'audience', 'summary', 'points', 'related_classes' ) ) );
	}

	public static function cities(): WP_REST_Response {
		return self::cached( self::simple( 'sts_city', array( 'is_base', 'intro', 'uses', 'areas', 'airport' ) ) );
	}

	public static function clients(): WP_REST_Response {
		$posts = get_posts( array( 'post_type' => 'sts_client', 'post_status' => 'publish', 'numberposts' => 200, 'orderby' => 'menu_order', 'order' => 'ASC' ) );

		$out = array();
		foreach ( $posts as $post ) {
			if ( ! get_post_meta( $post->ID, 'sts_show_logo', true ) ) {
				continue;
			}
			$src = wp_get_attachment_image_src( (int) get_post_thumbnail_id( $post ), 'full' );
			$out[] = array(
				'slug'     => $post->post_name,
				'name'     => $post->post_title,
				'industry' => (string) get_post_meta( $post->ID, 'sts_industry', true ),
				'logo'     => $src ? $src[0] : null,
				'width'    => $src ? $src[1] : null,
				'height'   => $src ? $src[2] : null,
			);
		}

		return self::cached( $out );
	}

	/**
	 * Unverified testimonials are never returned. Publishing a review nobody
	 * checked, with review markup, risks the whole domain.
	 */
	public static function testimonials(): WP_REST_Response {
		$posts = get_posts( array( 'post_type' => 'sts_testimonial', 'post_status' => 'publish', 'numberposts' => 100 ) );

		$out = array();
		foreach ( $posts as $post ) {
			if ( ! get_post_meta( $post->ID, 'sts_verified', true ) ) {
				continue;
			}
			$out[] = array(
				'id'         => 't-' . $post->ID,
				'authorName' => (string) get_post_meta( $post->ID, 'sts_author_name', true ),
				'company'    => ( (string) get_post_meta( $post->ID, 'sts_company', true ) ) ?: null,
				'rating'     => (int) get_post_meta( $post->ID, 'sts_rating', true ),
				'body'       => wp_strip_all_tags( $post->post_content ),
				'source'     => (string) get_post_meta( $post->ID, 'sts_source', true ),
				'date'       => get_the_date( 'Y-m-d', $post ),
				'verified'   => true,
			);
		}

		return self::cached( $out );
	}

	public static function team(): WP_REST_Response {
		return self::cached( self::simple( 'sts_team', array( 'role' ) ) );
	}

	public static function faqs(): WP_REST_Response {
		return self::cached( self::simple( 'sts_faq', array( 'topic' ) ) );
	}

	public static function availability( WP_REST_Request $request ): WP_REST_Response {
		global $wpdb;

		$table = STS_Install::table( 'availability' );
		$rows  = (array) $wpdb->get_results(
			$wpdb->prepare(
				"SELECT starts_on, ends_on, reason FROM {$table} WHERE vehicle_id = %d AND ends_on >= %s ORDER BY starts_on ASC",
				(int) $request['id'],
				gmdate( 'Y-m-d' )
			)
		);

		return self::cached(
			array(
				'source' => 'cms',
				'blocks' => array_map(
					static fn( $row ): array => array(
						'from'   => $row->starts_on,
						'to'     => $row->ends_on,
						'reason' => $row->reason,
					),
					$rows
				),
			)
		);
	}

	private static function simple( string $post_type, array $keys ): array {
		$posts = get_posts(
			array( 'post_type' => $post_type, 'post_status' => 'publish', 'numberposts' => 200, 'orderby' => 'menu_order', 'order' => 'ASC' )
		);

		return array_map(
			static function ( WP_Post $post ) use ( $keys ): array {
				$item = array(
					'id'      => $post->post_type . '-' . $post->ID,
					'slug'    => $post->post_name,
					'title'   => $post->post_title,
					'content' => $post->post_content,
					'image'   => get_the_post_thumbnail_url( $post, 'full' ) ?: null,
				);
				foreach ( $keys as $key ) {
					$item[ $key ] = get_post_meta( $post->ID, 'sts_' . $key, true );
				}
				return $item;
			},
			$posts
		);
	}

	private static function lines( mixed $value ): array {
		return array_values( array_filter( array_map( 'trim', explode( "\n", (string) $value ) ) ) );
	}

	/** "Name|#RRGGBB" per line. */
	private static function pairs( string $value ): array {
		$out = array();
		foreach ( self::lines( $value ) as $line ) {
			$parts = array_map( 'trim', explode( '|', $line ) );
			if ( count( $parts ) === 2 ) {
				$out[] = array( 'name' => $parts[0], 'hex' => $parts[1] );
			}
		}
		return $out;
	}

	/**
	 * Read responses are cacheable for a minute at the edge and revalidated in
	 * the background, so a burst of traffic does not become a burst of queries.
	 */
	private static function cached( mixed $data ): WP_REST_Response {
		$response = new WP_REST_Response( $data, 200 );
		$response->header( 'Cache-Control', 'public, max-age=60, stale-while-revalidate=600' );
		return $response;
	}
}
