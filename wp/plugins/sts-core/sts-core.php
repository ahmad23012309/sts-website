<?php
/**
 * Plugin Name:       STS Core
 * Description:       Fleet, rates, bookings and settings for the Sidhu Travel Services website. The site reads from this plugin; nothing the office needs to change lives in the website's code.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Sidhu Travel Services
 * Text Domain:       sts-core
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

define( 'STS_CORE_VERSION', '1.0.0' );
define( 'STS_CORE_FILE', __FILE__ );
define( 'STS_CORE_DIR', plugin_dir_path( __FILE__ ) );

require_once STS_CORE_DIR . 'includes/class-install.php';
require_once STS_CORE_DIR . 'includes/class-post-types.php';
require_once STS_CORE_DIR . 'includes/class-fields.php';
require_once STS_CORE_DIR . 'includes/class-settings.php';
require_once STS_CORE_DIR . 'includes/class-rate-log.php';
require_once STS_CORE_DIR . 'includes/class-api-keys.php';
require_once STS_CORE_DIR . 'includes/class-submissions.php';
require_once STS_CORE_DIR . 'includes/class-webhooks.php';
require_once STS_CORE_DIR . 'includes/class-rest-read.php';
require_once STS_CORE_DIR . 'includes/class-rest-write.php';
require_once STS_CORE_DIR . 'includes/class-seed.php';
require_once STS_CORE_DIR . 'includes/class-admin.php';
require_once STS_CORE_DIR . 'includes/class-frontend-cache.php';
require_once STS_CORE_DIR . 'includes/class-security.php';

register_activation_hook( __FILE__, array( 'STS_Install', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'STS_Install', 'deactivate' ) );

/**
 * Wires everything up once WordPress is ready.
 */
function sts_core_boot(): void {
	STS_Install::maybe_upgrade();
	STS_Post_Types::init();
	STS_Fields::init();
	STS_Settings::init();
	STS_Rate_Log::init();
	STS_Webhooks::init();
	STS_REST_Read::init();
	STS_REST_Write::init();
	STS_Seed::init();
	STS_Admin::init();
	STS_Frontend_Cache::init();
	STS_Security::init();
}
add_action( 'plugins_loaded', 'sts_core_boot' );
