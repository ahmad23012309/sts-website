<?php
/**
 * Starter data.
 *
 * The fleet register, the rates, the services, the cities, the routes and the
 * questions already exist; typing them into WordPress by hand would take an
 * afternoon and introduce mistakes the website would then publish. This imports
 * them from data/starter.json, which is generated from the website's own
 * fixtures so the two cannot disagree.
 *
 * It runs once, on the first admin page load after the plugin is activated, and
 * can be run again from the Starter data screen. Nothing it imports is ever
 * overwritten afterwards: a vehicle that already exists is left alone, and a
 * setting that already has a value is not touched. The office's own edits
 * always win over this file.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Seed {

	private const PENDING = 'sts_starter_pending';
	private const DONE    = 'sts_starter_imported';

	public static function init(): void {
		add_action( 'admin_init', array( __CLASS__, 'maybe_import' ) );
		add_action( 'admin_post_sts_import_starter', array( __CLASS__, 'handle_manual_import' ) );
	}

	/** Marks the import as due. Called from the activation hook. */
	public static function schedule(): void {
		if ( ! get_option( self::DONE ) ) {
			update_option( self::PENDING, 1 );
		}
	}

	/**
	 * Runs the first import.
	 *
	 * Deliberately on admin_init rather than on activation: the post types and
	 * the vehicle-class taxonomy are registered on init, and an import that ran
	 * before them could not file a vehicle under its class.
	 */
	public static function maybe_import(): void {
		if ( ! get_option( self::PENDING ) ) {
			return;
		}

		delete_option( self::PENDING );
		$result = self::import();
		update_option( self::DONE, gmdate( 'Y-m-d H:i:s' ) );
		set_transient( 'sts_starter_result', $result, 120 );
	}

	public static function handle_manual_import(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You cannot do that.', 'sts-core' ) );
		}
		check_admin_referer( 'sts_import_starter' );

		$result = self::import();
		update_option( self::DONE, gmdate( 'Y-m-d H:i:s' ) );
		set_transient( 'sts_starter_result', $result, 120 );

		wp_safe_redirect( admin_url( 'admin.php?page=sts-starter&imported=1' ) );
		exit;
	}

	/**
	 * @return array{created:int,skipped:int,settings:int,error:string}
	 */
	public static function import(): array {
		$result = array(
			'created'  => 0,
			'skipped'  => 0,
			'settings' => 0,
			'error'    => '',
		);

		$path = STS_CORE_DIR . 'data/starter.json';
		if ( ! is_readable( $path ) ) {
			$result['error'] = __( 'The starter data file is missing from the plugin.', 'sts-core' );
			return $result;
		}

		$raw  = (string) file_get_contents( $path );
		$data = json_decode( $raw, true );

		if ( ! is_array( $data ) || ! isset( $data['posts'] ) ) {
			$result['error'] = __( 'The starter data file could not be read.', 'sts-core' );
			return $result;
		}

		foreach ( (array) $data['posts'] as $post_type => $rows ) {
			if ( ! in_array( $post_type, STS_Post_Types::slugs(), true ) ) {
				continue;
			}

			foreach ( (array) $rows as $row ) {
				if ( self::import_post( (string) $post_type, (array) $row ) ) {
					++$result['created'];
				} else {
					++$result['skipped'];
				}
			}
		}

		if ( isset( $data['settings'] ) ) {
			$result['settings'] = self::import_settings( (array) $data['settings'] );
		}

		return $result;
	}

	/** @return bool True when a post was created. */
	private static function import_post( string $post_type, array $row ): bool {
		$slug = sanitize_title( (string) ( $row['slug'] ?? '' ) );
		if ( '' === $slug ) {
			return false;
		}

		$existing = get_posts(
			array(
				'post_type'        => $post_type,
				'name'             => $slug,
				'post_status'      => 'any',
				'numberposts'      => 1,
				'fields'           => 'ids',
				'suppress_filters' => false,
			)
		);

		// Already there: the office may have edited it, so it is left as it is.
		if ( ! empty( $existing ) ) {
			return false;
		}

		$id = wp_insert_post(
			array(
				'post_type'    => $post_type,
				'post_name'    => $slug,
				'post_title'   => (string) ( $row['title'] ?? $slug ),
				'post_content' => (string) ( $row['content'] ?? '' ),
				'post_status'  => 'publish',
			),
			true
		);

		if ( is_wp_error( $id ) ) {
			return false;
		}

		/**
		 * Field names in the starter data match the schema in STS_Fields, which
		 * stores them under an "sts_" prefix. Writing them unprefixed leaves the
		 * post looking complete in the editor while every endpoint reads blank.
		 */
		foreach ( (array) ( $row['meta'] ?? array() ) as $key => $value ) {
			update_post_meta( $id, 'sts_' . (string) $key, $value );
		}

		if ( ! empty( $row['class'] ) && 'sts_vehicle' === $post_type ) {
			wp_set_object_terms( $id, sanitize_title( (string) $row['class'] ), 'sts_vehicle_class' );
		}

		return true;
	}

	/**
	 * Fills in the settings that are still blank.
	 *
	 * A value the office has already typed is never replaced, so re-running the
	 * import cannot undo an afternoon's work.
	 *
	 * @return int How many fields were filled.
	 */
	private static function import_settings( array $groups ): int {
		$filled = 0;

		foreach ( $groups as $group => $values ) {
			$current = STS_Settings::get( (string) $group );
			$next    = $current;

			foreach ( (array) $values as $key => $value ) {
				$have = $current[ $key ] ?? '';
				if ( '' !== $have && null !== $have && false !== $have ) {
					continue;
				}
				if ( '' === $value || null === $value ) {
					continue;
				}

				$next[ $key ] = $value;
				++$filled;
			}

			if ( $next !== $current ) {
				update_option( 'sts_settings_' . $group, $next );
			}
		}

		return $filled;
	}

	public static function render_screen(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You cannot see this.', 'sts-core' ) );
		}

		$done   = (string) get_option( self::DONE, '' );
		$result = get_transient( 'sts_starter_result' );

		echo '<div class="wrap"><h1>' . esc_html__( 'Starter data', 'sts-core' ) . '</h1>';

		echo '<p>' . esc_html__( 'The fleet, the rates, the services, the cities, the routes, the questions and the client list, taken from the register the website was built from.', 'sts-core' ) . '</p>';

		if ( is_array( $result ) ) {
			if ( ! empty( $result['error'] ) ) {
				echo '<div class="notice notice-error"><p>' . esc_html( (string) $result['error'] ) . '</p></div>';
			} else {
				echo '<div class="notice notice-success"><p>' . esc_html(
					sprintf(
						/* translators: 1: entries added, 2: entries already present, 3: settings filled. */
						__( 'Added %1$d entries, left %2$d already here untouched, and filled %3$d blank settings.', 'sts-core' ),
						(int) $result['created'],
						(int) $result['skipped'],
						(int) $result['settings']
					)
				) . '</p></div>';
			}
			delete_transient( 'sts_starter_result' );
		}

		if ( '' !== $done ) {
			echo '<p><em>' . esc_html( sprintf( /* translators: date and time. */ __( 'Last imported %s UTC.', 'sts-core' ), $done ) ) . '</em></p>';
		}

		echo '<p>' . esc_html__( 'Running this again only adds what is missing. Anything already here, and any setting that already has a value, is left exactly as it is.', 'sts-core' ) . '</p>';

		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
		wp_nonce_field( 'sts_import_starter' );
		echo '<input type="hidden" name="action" value="sts_import_starter">';
		submit_button( __( 'Import what is missing', 'sts-core' ) );
		echo '</form></div>';
	}
}
