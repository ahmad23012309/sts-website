<?php
/**
 * Database tables and upgrades.
 *
 * Bookings, leads, availability, API keys, the outbound queue and the rate log
 * live in their own tables rather than in wp_posts. They carry personal data,
 * they need indexed date-range queries, and none of them should ever be
 * reachable through a generic WordPress REST endpoint.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Install {

	const DB_VERSION_OPTION = 'sts_core_db_version';
	const DB_VERSION        = 3;

	public static function activate(): void {
		// Queued rather than run here: the post types are registered on init,
		// which has not fired during activation.
		STS_Seed::schedule();
		self::create_tables();
		update_option( self::DB_VERSION_OPTION, self::DB_VERSION );

		if ( ! wp_next_scheduled( 'sts_drain_webhook_queue' ) ) {
			wp_schedule_event( time() + 60, 'sts_every_five_minutes', 'sts_drain_webhook_queue' );
		}

		flush_rewrite_rules();
	}

	public static function deactivate(): void {
		wp_clear_scheduled_hook( 'sts_drain_webhook_queue' );
		flush_rewrite_rules();
	}

	/**
	 * Runs after a plugin update without the site owner having to reactivate.
	 */
	public static function maybe_upgrade(): void {
		if ( (int) get_option( self::DB_VERSION_OPTION, 0 ) === self::DB_VERSION ) {
			return;
		}
		self::create_tables();
		update_option( self::DB_VERSION_OPTION, self::DB_VERSION );
	}

	public static function table( string $name ): string {
		global $wpdb;
		return $wpdb->prefix . 'sts_' . $name;
	}

	private static function create_tables(): void {
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$charset = $wpdb->get_charset_collate();

		$bookings = self::table( 'bookings' );
		dbDelta(
			"CREATE TABLE {$bookings} (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				reference VARCHAR(20) NOT NULL,
				kind VARCHAR(32) NOT NULL DEFAULT 'booking',
				status VARCHAR(20) NOT NULL DEFAULT 'new',
				customer_name VARCHAR(120) NOT NULL,
				phone VARCHAR(32) NOT NULL,
				email VARCHAR(160) NULL,
				company VARCHAR(160) NULL,
				vehicle_slug VARCHAR(120) NULL,
				vehicle_category VARCHAR(40) NULL,
				pickup_date DATE NULL,
				dropoff_date DATE NULL,
				city VARCHAR(60) NULL,
				pickup_location VARCHAR(200) NULL,
				dropoff_location VARCHAR(200) NULL,
				with_fuel TINYINT(1) NOT NULL DEFAULT 1,
				with_driver TINYINT(1) NOT NULL DEFAULT 1,
				estimated_total DECIMAL(12,2) NULL,
				notes TEXT NULL,
				payload LONGTEXT NULL,
				source VARCHAR(40) NOT NULL DEFAULT 'website',
				created_at DATETIME NOT NULL,
				updated_at DATETIME NOT NULL,
				PRIMARY KEY (id),
				UNIQUE KEY reference (reference),
				KEY status (status),
				KEY kind (kind),
				KEY pickup_date (pickup_date),
				KEY created_at (created_at)
			) {$charset};"
		);

		$availability = self::table( 'availability' );
		dbDelta(
			"CREATE TABLE {$availability} (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				vehicle_id BIGINT UNSIGNED NOT NULL,
				starts_on DATE NOT NULL,
				ends_on DATE NOT NULL,
				reason VARCHAR(20) NOT NULL DEFAULT 'booked',
				booking_id BIGINT UNSIGNED NULL,
				note VARCHAR(200) NULL,
				created_at DATETIME NOT NULL,
				PRIMARY KEY (id),
				KEY vehicle_range (vehicle_id, starts_on, ends_on)
			) {$charset};"
		);

		$keys = self::table( 'api_keys' );
		dbDelta(
			"CREATE TABLE {$keys} (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				label VARCHAR(120) NOT NULL,
				prefix VARCHAR(12) NOT NULL,
				token_hash VARCHAR(255) NOT NULL,
				scopes VARCHAR(255) NOT NULL DEFAULT 'read',
				created_at DATETIME NOT NULL,
				last_used_at DATETIME NULL,
				revoked_at DATETIME NULL,
				PRIMARY KEY (id),
				UNIQUE KEY prefix (prefix)
			) {$charset};"
		);

		$queue = self::table( 'webhook_queue' );
		dbDelta(
			"CREATE TABLE {$queue} (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				booking_id BIGINT UNSIGNED NULL,
				event VARCHAR(60) NOT NULL,
				payload LONGTEXT NOT NULL,
				status VARCHAR(20) NOT NULL DEFAULT 'pending',
				attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0,
				next_attempt_at DATETIME NOT NULL,
				last_response TEXT NULL,
				created_at DATETIME NOT NULL,
				PRIMARY KEY (id),
				KEY status_due (status, next_attempt_at)
			) {$charset};"
		);

		$rate_log = self::table( 'rate_log' );
		dbDelta(
			"CREATE TABLE {$rate_log} (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				user_id BIGINT UNSIGNED NULL,
				user_login VARCHAR(80) NULL,
				subject VARCHAR(120) NOT NULL,
				field VARCHAR(120) NOT NULL,
				old_value TEXT NULL,
				new_value TEXT NULL,
				changed_at DATETIME NOT NULL,
				PRIMARY KEY (id),
				KEY subject (subject),
				KEY changed_at (changed_at)
			) {$charset};"
		);

		$fuel = self::table( 'fuel_history' );
		dbDelta(
			"CREATE TABLE {$fuel} (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				effective_from DATE NOT NULL,
				petrol DECIMAL(8,2) NOT NULL,
				diesel DECIMAL(8,2) NULL,
				hi_octane DECIMAL(8,2) NULL,
				note VARCHAR(255) NULL,
				created_at DATETIME NOT NULL,
				PRIMARY KEY (id),
				UNIQUE KEY effective_from (effective_from)
			) {$charset};"
		);
	}
}

/**
 * The queue is drained every five minutes; WordPress has no such interval.
 */
add_filter(
	'cron_schedules',
	static function ( array $schedules ): array {
		$schedules['sts_every_five_minutes'] = array(
			'interval' => 300,
			'display'  => __( 'Every five minutes', 'sts-core' ),
		);
		return $schedules;
	}
);
