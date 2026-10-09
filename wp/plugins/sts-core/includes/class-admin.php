<?php
/**
 * The admin screens.
 *
 * One menu holds everything the office touches, so nobody has to know which
 * part of WordPress a setting happens to live in.
 *
 * @package STS_Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

class STS_Admin {

	const CAP = 'manage_options';

	public static function init(): void {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'add_meta_boxes', array( __CLASS__, 'meta_boxes' ) );
		add_action( 'save_post', array( __CLASS__, 'save_meta' ), 10, 2 );
		add_action( 'admin_post_sts_issue_key', array( __CLASS__, 'handle_issue_key' ) );
		add_action( 'admin_post_sts_revoke_key', array( __CLASS__, 'handle_revoke_key' ) );
		add_action( 'admin_post_sts_retry_webhook', array( __CLASS__, 'handle_retry_webhook' ) );
		add_action( 'admin_post_sts_set_status', array( __CLASS__, 'handle_set_status' ) );
	}

	public static function menu(): void {
		add_menu_page(
			__( 'Sidhu Travel', 'sts-core' ),
			__( 'Sidhu Travel', 'sts-core' ),
			'edit_posts',
			'sts-core',
			array( __CLASS__, 'render_bookings' ),
			'dashicons-car',
			3
		);

		add_submenu_page( 'sts-core', __( 'Bookings', 'sts-core' ), __( 'Bookings', 'sts-core' ), 'edit_posts', 'sts-core', array( __CLASS__, 'render_bookings' ) );

		foreach ( STS_Settings::groups() as $group => $config ) {
			add_submenu_page(
				'sts-core',
				$config['label'],
				$config['label'],
				self::CAP,
				'sts-settings-' . $group,
				static fn() => self::render_settings( $group )
			);
		}

		add_submenu_page( 'sts-core', __( 'API keys', 'sts-core' ), __( 'API keys', 'sts-core' ), self::CAP, 'sts-api-keys', array( __CLASS__, 'render_keys' ) );
		add_submenu_page( 'sts-core', __( 'Delivery queue', 'sts-core' ), __( 'Delivery queue', 'sts-core' ), self::CAP, 'sts-queue', array( __CLASS__, 'render_queue' ) );
		add_submenu_page( 'sts-core', __( 'Rate changes', 'sts-core' ), __( 'Rate changes', 'sts-core' ), self::CAP, 'sts-rate-log', array( __CLASS__, 'render_rate_log' ) );
	}

	/* --------------------------------------------------------------------- */
	/* Settings                                                              */
	/* --------------------------------------------------------------------- */

	public static function render_settings( string $group ): void {
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( esc_html__( 'You cannot change these.', 'sts-core' ) );
		}

		$groups = STS_Settings::groups();
		$config = $groups[ $group ] ?? null;
		if ( ! $config ) {
			return;
		}

		$values = STS_Settings::get( $group );
		$name   = STS_Settings::OPTION_PREFIX . $group;

		echo '<div class="wrap"><h1>' . esc_html( $config['label'] ) . '</h1>';
		echo '<form method="post" action="options.php">';
		settings_fields( 'sts_settings_' . $group );
		echo '<table class="form-table" role="presentation"><tbody>';

		foreach ( $config['fields'] as $key => $field ) {
			$id    = $name . '_' . $key;
			$value = $values[ $key ] ?? '';
			$input = $name . '[' . $key . ']';

			echo '<tr><th scope="row"><label for="' . esc_attr( $id ) . '">' . esc_html( $field['label'] );
			if ( ! empty( $field['logged'] ) ) {
				echo ' <span class="dashicons dashicons-clock" title="' . esc_attr__( 'Changes to this are recorded', 'sts-core' ) . '"></span>';
			}
			echo '</label></th><td>';

			switch ( $field['type'] ) {
				case 'checkbox':
					echo '<input type="checkbox" id="' . esc_attr( $id ) . '" name="' . esc_attr( $input ) . '" value="1" ' . checked( (bool) $value, true, false ) . ' />';
					break;
				case 'textarea':
					echo '<textarea id="' . esc_attr( $id ) . '" name="' . esc_attr( $input ) . '" rows="5" class="large-text code">' . esc_textarea( (string) $value ) . '</textarea>';
					break;
				case 'password':
					echo '<input type="password" id="' . esc_attr( $id ) . '" name="' . esc_attr( $input ) . '" value="' . esc_attr( (string) $value ) . '" class="regular-text" autocomplete="new-password" />';
					break;
				case 'number':
					echo '<input type="number" step="any" id="' . esc_attr( $id ) . '" name="' . esc_attr( $input ) . '" value="' . esc_attr( (string) $value ) . '" class="small-text" />';
					break;
				case 'date':
					echo '<input type="date" id="' . esc_attr( $id ) . '" name="' . esc_attr( $input ) . '" value="' . esc_attr( (string) $value ) . '" />';
					break;
				default:
					echo '<input type="text" id="' . esc_attr( $id ) . '" name="' . esc_attr( $input ) . '" value="' . esc_attr( (string) $value ) . '" class="regular-text" />';
			}

			echo '</td></tr>';
		}

		echo '</tbody></table>';
		submit_button();
		echo '</form></div>';
	}

	/* --------------------------------------------------------------------- */
	/* Post meta                                                             */
	/* --------------------------------------------------------------------- */

	public static function meta_boxes(): void {
		foreach ( array_keys( STS_Fields::schema() ) as $post_type ) {
			add_meta_box(
				'sts-fields',
				__( 'Details', 'sts-core' ),
				array( __CLASS__, 'render_meta_box' ),
				$post_type,
				'normal',
				'high'
			);
		}
	}

	public static function render_meta_box( WP_Post $post ): void {
		$fields = STS_Fields::schema()[ $post->post_type ] ?? array();
		wp_nonce_field( 'sts_save_meta', 'sts_meta_nonce' );

		echo '<table class="form-table" role="presentation"><tbody>';

		foreach ( $fields as $key => $field ) {
			if ( 'section' === $field['type'] ) {
				echo '<tr><th colspan="2"><h2 style="margin:1em 0 0">' . esc_html( $field['label'] ) . '</h2></th></tr>';
				continue;
			}

			$name  = 'sts_' . $key;
			$value = get_post_meta( $post->ID, $name, true );

			echo '<tr><th scope="row"><label for="' . esc_attr( $name ) . '">' . esc_html( $field['label'] ) . '</label></th><td>';

			switch ( $field['type'] ) {
				case 'checkbox':
					echo '<input type="checkbox" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="1" ' . checked( (bool) $value, true, false ) . ' />';
					break;
				case 'select':
					echo '<select id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '">';
					foreach ( $field['options'] as $option ) {
						echo '<option value="' . esc_attr( $option ) . '" ' . selected( $value, $option, false ) . '>' . esc_html( ucfirst( $option ) ) . '</option>';
					}
					echo '</select>';
					break;
				case 'textarea':
				case 'repeater':
					echo '<textarea id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" rows="4" class="large-text code">' . esc_textarea( (string) $value ) . '</textarea>';
					if ( 'repeater' === $field['type'] ) {
						echo '<p class="description">' . esc_html__( 'One per line, as: Name|#RRGGBB', 'sts-core' ) . '</p>';
					}
					break;
				case 'media':
					echo '<input type="text" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '" class="large-text" />';
					echo '<p class="description">' . esc_html__( 'Attachment IDs, comma separated. The first is the card image.', 'sts-core' ) . '</p>';
					break;
				case 'number':
				case 'money':
					echo '<input type="number" step="' . esc_attr( $field['step'] ?? 'any' ) . '" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '" class="small-text" />';
					break;
				default:
					echo '<input type="text" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '" class="regular-text" />';
			}

			echo '</td></tr>';
		}

		echo '</tbody></table>';
	}

	public static function save_meta( int $post_id, WP_Post $post ): void {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! isset( $_POST['sts_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( (string) $_POST['sts_meta_nonce'] ) ), 'sts_save_meta' ) ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$fields = STS_Fields::schema()[ $post->post_type ] ?? array();

		foreach ( $fields as $key => $field ) {
			if ( 'section' === $field['type'] ) {
				continue;
			}

			$name      = 'sts_' . $key;
			$sanitizer = STS_Fields::sanitizer( $field['type'] );

			if ( 'checkbox' === $field['type'] ) {
				update_post_meta( $post_id, $name, ! empty( $_POST[ $name ] ) );
				continue;
			}

			$raw = isset( $_POST[ $name ] ) ? wp_unslash( $_POST[ $name ] ) : '';
			update_post_meta( $post_id, $name, $sanitizer( $raw ) );
		}
	}

	/* --------------------------------------------------------------------- */
	/* Bookings                                                              */
	/* --------------------------------------------------------------------- */

	public static function render_bookings(): void {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( esc_html__( 'You cannot see these.', 'sts-core' ) );
		}

		$status   = isset( $_GET['status'] ) ? sanitize_key( wp_unslash( (string) $_GET['status'] ) ) : '';
		$bookings = STS_Submissions::listing( array( 'status' => $status, 'limit' => 200 ) );

		echo '<div class="wrap"><h1>' . esc_html__( 'Bookings and enquiries', 'sts-core' ) . '</h1>';

		echo '<ul class="subsubsub"><li><a href="' . esc_url( admin_url( 'admin.php?page=sts-core' ) ) . '">' . esc_html__( 'All', 'sts-core' ) . '</a></li>';
		foreach ( STS_Submissions::STATUSES as $value ) {
			echo ' | <li><a href="' . esc_url( admin_url( 'admin.php?page=sts-core&status=' . $value ) ) . '">' . esc_html( ucfirst( $value ) ) . '</a></li>';
		}
		echo '</ul><br class="clear" />';

		echo '<table class="wp-list-table widefat striped"><thead><tr>';
		foreach ( array( 'Reference', 'Type', 'Name', 'Phone', 'Vehicle', 'Dates', 'Status', 'Received' ) as $heading ) {
			echo '<th>' . esc_html( $heading ) . '</th>';
		}
		echo '</tr></thead><tbody>';

		if ( empty( $bookings ) ) {
			echo '<tr><td colspan="8">' . esc_html__( 'Nothing yet.', 'sts-core' ) . '</td></tr>';
		}

		foreach ( $bookings as $booking ) {
			echo '<tr>';
			echo '<td><strong>' . esc_html( $booking->reference ) . '</strong></td>';
			echo '<td>' . esc_html( $booking->kind ) . '</td>';
			echo '<td>' . esc_html( $booking->customer_name ) . ( $booking->company ? '<br /><small>' . esc_html( $booking->company ) . '</small>' : '' ) . '</td>';
			echo '<td><a href="tel:' . esc_attr( $booking->phone ) . '">' . esc_html( $booking->phone ) . '</a></td>';
			echo '<td>' . esc_html( (string) $booking->vehicle_slug ) . '</td>';
			echo '<td>' . esc_html( trim( (string) $booking->pickup_date . ' – ' . (string) $booking->dropoff_date, ' –' ) ) . '</td>';
			echo '<td><form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
			wp_nonce_field( 'sts_set_status' );
			echo '<input type="hidden" name="action" value="sts_set_status" /><input type="hidden" name="id" value="' . esc_attr( (string) $booking->id ) . '" />';
			echo '<select name="status" onchange="this.form.submit()">';
			foreach ( STS_Submissions::STATUSES as $value ) {
				echo '<option value="' . esc_attr( $value ) . '" ' . selected( $booking->status, $value, false ) . '>' . esc_html( ucfirst( $value ) ) . '</option>';
			}
			echo '</select></form></td>';
			echo '<td>' . esc_html( $booking->created_at ) . '</td>';
			echo '</tr>';
		}

		echo '</tbody></table></div>';
	}

	public static function handle_set_status(): void {
		check_admin_referer( 'sts_set_status' );
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'sts-core' ) );
		}

		STS_Submissions::update_status(
			(int) ( $_POST['id'] ?? 0 ),
			sanitize_key( wp_unslash( (string) ( $_POST['status'] ?? '' ) ) )
		);

		wp_safe_redirect( admin_url( 'admin.php?page=sts-core' ) );
		exit;
	}

	/* --------------------------------------------------------------------- */
	/* API keys                                                              */
	/* --------------------------------------------------------------------- */

	public static function render_keys(): void {
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'sts-core' ) );
		}

		echo '<div class="wrap"><h1>' . esc_html__( 'API keys', 'sts-core' ) . '</h1>';
		echo '<p>' . esc_html__( 'Keys let the management software read bookings. A key is shown once, when it is created, and never again. If it is lost, revoke it and issue another.', 'sts-core' ) . '</p>';

		$issued = get_transient( 'sts_last_issued_key' );
		if ( $issued ) {
			delete_transient( 'sts_last_issued_key' );
			echo '<div class="notice notice-success"><p><strong>' . esc_html__( 'Copy this now. It will not be shown again:', 'sts-core' ) . '</strong></p>';
			echo '<p><code style="font-size:14px;user-select:all">' . esc_html( (string) $issued ) . '</code></p></div>';
		}

		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" style="margin:1.5em 0">';
		wp_nonce_field( 'sts_issue_key' );
		echo '<input type="hidden" name="action" value="sts_issue_key" />';
		echo '<input type="text" name="label" required placeholder="' . esc_attr__( 'What is this key for?', 'sts-core' ) . '" class="regular-text" /> ';
		submit_button( __( 'Issue a key', 'sts-core' ), 'primary', 'submit', false );
		echo '</form>';

		echo '<table class="wp-list-table widefat striped"><thead><tr><th>Label</th><th>Prefix</th><th>Created</th><th>Last used</th><th>Status</th><th></th></tr></thead><tbody>';

		foreach ( STS_API_Keys::all() as $key ) {
			$revoked = ! empty( $key->revoked_at );
			echo '<tr>';
			echo '<td>' . esc_html( $key->label ) . '</td>';
			echo '<td><code>' . esc_html( $key->prefix ) . '</code></td>';
			echo '<td>' . esc_html( $key->created_at ) . '</td>';
			echo '<td>' . esc_html( $key->last_used_at ?? '—' ) . '</td>';
			echo '<td>' . ( $revoked ? esc_html__( 'Revoked', 'sts-core' ) : esc_html__( 'Active', 'sts-core' ) ) . '</td>';
			echo '<td>';
			if ( ! $revoked ) {
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" onsubmit="return confirm(\'Revoke this key? The software using it will stop working immediately.\')">';
				wp_nonce_field( 'sts_revoke_key' );
				echo '<input type="hidden" name="action" value="sts_revoke_key" /><input type="hidden" name="id" value="' . esc_attr( (string) $key->id ) . '" />';
				submit_button( __( 'Revoke', 'sts-core' ), 'delete small', 'submit', false );
				echo '</form>';
			}
			echo '</td></tr>';
		}

		echo '</tbody></table></div>';
	}

	public static function handle_issue_key(): void {
		check_admin_referer( 'sts_issue_key' );
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'sts-core' ) );
		}

		$token = STS_API_Keys::issue( sanitize_text_field( wp_unslash( (string) ( $_POST['label'] ?? 'Key' ) ) ) );
		set_transient( 'sts_last_issued_key', $token, 60 );

		wp_safe_redirect( admin_url( 'admin.php?page=sts-api-keys' ) );
		exit;
	}

	public static function handle_revoke_key(): void {
		check_admin_referer( 'sts_revoke_key' );
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'sts-core' ) );
		}

		STS_API_Keys::revoke( (int) ( $_POST['id'] ?? 0 ) );
		wp_safe_redirect( admin_url( 'admin.php?page=sts-api-keys' ) );
		exit;
	}

	/* --------------------------------------------------------------------- */
	/* Queue and rate log                                                    */
	/* --------------------------------------------------------------------- */

	public static function render_queue(): void {
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'sts-core' ) );
		}

		echo '<div class="wrap"><h1>' . esc_html__( 'Delivery queue', 'sts-core' ) . '</h1>';
		echo '<p>' . esc_html__( 'Bookings on their way to the management software. A failed one is kept here so it can be sent again rather than disappearing.', 'sts-core' ) . '</p>';
		echo '<table class="wp-list-table widefat striped"><thead><tr><th>ID</th><th>Event</th><th>Status</th><th>Attempts</th><th>Next attempt</th><th>Last response</th><th></th></tr></thead><tbody>';

		foreach ( STS_Webhooks::listing() as $row ) {
			echo '<tr>';
			echo '<td>' . esc_html( (string) $row->id ) . '</td>';
			echo '<td>' . esc_html( $row->event ) . '</td>';
			echo '<td>' . esc_html( $row->status ) . '</td>';
			echo '<td>' . esc_html( (string) $row->attempts ) . '</td>';
			echo '<td>' . esc_html( (string) $row->next_attempt_at ) . '</td>';
			echo '<td><code>' . esc_html( (string) $row->last_response ) . '</code></td>';
			echo '<td>';
			if ( 'delivered' !== $row->status ) {
				echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
				wp_nonce_field( 'sts_retry_webhook' );
				echo '<input type="hidden" name="action" value="sts_retry_webhook" /><input type="hidden" name="id" value="' . esc_attr( (string) $row->id ) . '" />';
				submit_button( __( 'Send again', 'sts-core' ), 'secondary small', 'submit', false );
				echo '</form>';
			}
			echo '</td></tr>';
		}

		echo '</tbody></table></div>';
	}

	public static function handle_retry_webhook(): void {
		check_admin_referer( 'sts_retry_webhook' );
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'sts-core' ) );
		}

		STS_Webhooks::retry( (int) ( $_POST['id'] ?? 0 ) );
		wp_safe_redirect( admin_url( 'admin.php?page=sts-queue' ) );
		exit;
	}

	public static function render_rate_log(): void {
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'sts-core' ) );
		}

		echo '<div class="wrap"><h1>' . esc_html__( 'Rate changes', 'sts-core' ) . '</h1>';
		echo '<p>' . esc_html__( 'Every change to a price, a fuel rate or a pricing rule, with who made it. This is the record that settles an argument about what a rate was on a given day.', 'sts-core' ) . '</p>';
		echo '<table class="wp-list-table widefat striped"><thead><tr><th>When</th><th>Who</th><th>What</th><th>Field</th><th>From</th><th>To</th></tr></thead><tbody>';

		foreach ( STS_Rate_Log::recent() as $row ) {
			echo '<tr>';
			echo '<td>' . esc_html( $row->changed_at ) . '</td>';
			echo '<td>' . esc_html( (string) $row->user_login ) . '</td>';
			echo '<td>' . esc_html( $row->subject ) . '</td>';
			echo '<td>' . esc_html( $row->field ) . '</td>';
			echo '<td>' . esc_html( (string) $row->old_value ) . '</td>';
			echo '<td><strong>' . esc_html( (string) $row->new_value ) . '</strong></td>';
			echo '</tr>';
		}

		echo '</tbody></table></div>';
	}
}
