<?php
/**
 * Tells the website to drop its cache.
 *
 * The website caches what it reads from this backend so that a page load does
 * not wait on WordPress. That cache has to be cleared when something changes,
 * or a new fuel rate sits here for a minute before anyone sees it.
 *
 * Every save of a vehicle, a service, a city, a client, a testimonial, a route
 * or an FAQ, and every change to a settings group, sends one signed ping. The
 * ping carries no content: the website re-reads what it needs itself, so a
 * captured ping cannot be used to put anything on the site.
 *
 * @package STS_Core
 */

defined( 'ABSPATH' ) || exit;

class STS_Frontend_Cache {

	/**
	 * Pings are collected and sent once at the end of the request. Saving a
	 * vehicle fires several meta hooks, and each one must not cost an outbound
	 * HTTP call while the editor waits.
	 */
	private static bool $queued = false;

	public static function init(): void {
		foreach ( STS_Post_Types::slugs() as $slug ) {
			add_action( "save_post_{$slug}", array( __CLASS__, 'queue' ), 10, 0 );
		}

		add_action( 'deleted_post', array( __CLASS__, 'queue' ), 10, 0 );
		add_action( 'sts_settings_saved', array( __CLASS__, 'queue' ), 10, 0 );
		add_action( 'sts_availability_changed', array( __CLASS__, 'queue' ), 10, 0 );
		add_action( 'shutdown', array( __CLASS__, 'send' ), 10, 0 );
	}

	public static function queue(): void {
		self::$queued = true;
	}

	public static function send(): void {
		if ( ! self::$queued ) {
			return;
		}

		self::$queued = false;

		$endpoint = trim( (string) STS_Settings::value( 'integration', 'revalidate_url', '' ) );
		$secret   = (string) STS_Settings::value( 'integration', 'revalidate_secret', '' );

		if ( '' === $endpoint || '' === $secret ) {
			return;
		}

		$body      = wp_json_encode( array( 'reason' => 'content-changed' ) );
		$timestamp = (string) time();

		wp_remote_post(
			$endpoint,
			array(
				'timeout'     => 5,
				'blocking'    => false,
				'headers'     => array(
					'Content-Type'    => 'application/json',
					'X-STS-Timestamp' => $timestamp,
					'X-STS-Signature' => hash_hmac( 'sha256', $timestamp . '.' . $body, $secret ),
				),
				'body'        => $body,
				'data_format' => 'body',
			)
		);
	}
}
