<?php
/**
 * Hardening.
 *
 * This install is a backend, not a website. Everything that only makes sense
 * for a public WordPress site is switched off, which removes most of what gets
 * a WordPress install attacked.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Security {

	public static function init(): void {
		add_filter( 'xmlrpc_enabled', '__return_false' );
		add_filter( 'rest_endpoints', array( __CLASS__, 'remove_user_endpoints' ) );
		add_action( 'template_redirect', array( __CLASS__, 'no_public_frontend' ) );
		add_filter( 'rest_authentication_errors', array( __CLASS__, 'require_auth_for_core_rest' ) );
		add_action( 'init', array( __CLASS__, 'strip_head_noise' ) );
		add_filter( 'login_errors', static fn(): string => __( 'Login failed.', 'sts-core' ) );
	}

	/**
	 * User enumeration through the REST API is how a password-guessing run
	 * usually starts.
	 */
	public static function remove_user_endpoints( array $endpoints ): array {
		foreach ( array_keys( $endpoints ) as $route ) {
			if ( str_starts_with( $route, '/wp/v2/users' ) ) {
				unset( $endpoints[ $route ] );
			}
		}
		return $endpoints;
	}

	/**
	 * Nobody should land on the backend by accident, so the front end sends
	 * visitors to the real website instead of rendering a theme.
	 */
	public static function no_public_frontend(): void {
		if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
			return;
		}

		$site = (string) STS_Settings::value( 'contact', 'public_site_url', '' );
		wp_safe_redirect( $site !== '' ? $site : 'https://sidhutravelservices.com', 301 );
		exit;
	}

	/**
	 * The core REST API is for logged-in editors. The website reads through the
	 * plugin's own namespace, which has its own public routes.
	 */
	public static function require_auth_for_core_rest( mixed $result ): mixed {
		if ( ! empty( $result ) ) {
			return $result;
		}

		$route = isset( $GLOBALS['wp']->query_vars['rest_route'] ) ? (string) $GLOBALS['wp']->query_vars['rest_route'] : '';
		if ( str_starts_with( $route, '/sts/' ) ) {
			return $result;
		}

		if ( ! is_user_logged_in() ) {
			return new WP_Error(
				'sts_rest_forbidden',
				__( 'Authentication required.', 'sts-core' ),
				array( 'status' => 401 )
			);
		}

		return $result;
	}

	public static function strip_head_noise(): void {
		remove_action( 'wp_head', 'wp_generator' );
		remove_action( 'wp_head', 'rsd_link' );
		remove_action( 'wp_head', 'wlwmanifest_link' );
		remove_action( 'wp_head', 'wp_shortlink_wp_head' );
	}
}
