<?php
/*
Plugin Name: Respect - spector
Version: 1.04
Plugin URI: https://zitwatin.wordpress.com/2016/03/25/aanleiding/
Description: Een plugin dat bijdrage-reflectie stimuleert
Author: Andrew van Ingen
Author URI: http://www.zitwat.in
Implementation: Andrew van Ingen @andrewvaningen
*/

// Add custom meta fields to the default comment form
// Default comment form includes name, email address and website URL
// Default comment form elements are hidden when user is logged in

class RespectComments {
	private $questions;

	public function __construct() {
		$this->init_questions();

		add_action( 'wp_enqueue_scripts',  array( $this, 'enqueue_scripts' ) );

		add_filter( 'comment_form_default_fields', array( $this, 'comment_default_fields' ) );
		add_filter( 'preprocess_comment', array( $this, 'verify_comment_meta' ) );
		add_filter( 'comment_text', array( $this, 'modify_comment' ) );

		add_action( 'comment_form_logged_in_after', array( $this, 'additional_fields' ) );
		add_action( 'comment_form_after_fields', array( $this, 'additional_fields' ) );
		add_action( 'comment_post', array( $this, 'save_comment_meta' ) );

		add_action( 'add_meta_boxes_comment', array( $this, 'comment_meta_boxes' ) );
		add_action( 'edit_comment', array( $this, 'extend_comment_edit_metafields' ) );
	}

	public function init_questions() {
		$plugin_url_path = WP_PLUGIN_URL;
		$this->questions = array(

/*
			array(
				'id'    => 'invalshoek',
				'title' => 'Wie ben je, NJOYER? Vanuit welke invalshoek kijk je en draag je bij aan dit gesprek?',
				'kopje' => 'Invalshoek:',
				'placeholder' => '',
				'next'  => 'detoegevoegdewaarde',
			),
*/
/*
			array(
				'id'    => 'artikelbeoordeling',
				'title' => 'NJOYER, Hoe vind je het artikel?',
				'kopje' => '_',
				'options' => array(
					array(
						'id' 	=> 'optie_zitwatin',
						'title' => 'Zit wat in!',
						'next'  => 'detoegevoegdewaarde',
					),
					array(
						'id' 	=> 'optie_zitniksin',
						'title' => 'Zit niks in',
						'next'  => 'zitniksin',
					),
				),
			),
*/
			array(
				'id'    => 'detoegevoegdewaarde',
				'title' => 'NJOYER, Wat triggert je? Herken je zaken? <br/> Zit \'r wat in voor jou?',
				'kopje' => 'De toegevoegde waarde:',
				'placeholder' => 'Bijdrageveld 1 van 2',
				'next'  => 'decomment',
			),
			array(
				'id'    => 'decomment',
				'title' => 'Welke waarde kun jij toevoegen, NJOYER? Een vraag kan ook! Wat kunnen we van jou leren? <span class="required">*</span>',
				'kopje' => 'Mijn bijdrage:',
				'placeholder' => 'Bijdrageveld 2 van 2',
				'next'  => 'decommentisingevuld',
			),
			array(
				'id'    => 'decommentisingevuld',
				'title' => 'Bedankt voor je bijdrage, NJOYER! <br/> Die kun je nu publiceren. <br/> Tot de volgende keer!',
			),
/*
			array(
				'id'    => 'einde',
				'title' => 'NJOYER, Je wordt zo gevraagd je bijdrage te bevestigen! Nogmaals bedankt! Tot de volgende keer!',
			),
*/			
/*
			array(
				'id'    => 'decommentisingevuldeerstekeer',
				'title' => 'NJOYER, Dankjewel voor je bijdrage!',
				'options' => array(
					array(
						'id'	=> 'optie_begeleiding_prettig',
						'title' => 'Spector, ik vond je begeleiding prettig!',
						'next'  => 'begeleidingisprettig',
					),
					array(
						'id'	=> 'optie_begeleiding_tips',
						'title' => 'Spector, ik heb tips voor je.',
						'next'  => 'begeleidingstips',
					),
				),
			),
			array(
				'id'    => 'begeleidingisprettig',
				'title' => 'Daar ben ik blij om!',
				'options' => array(
					array(
						'id'	=> 'optie_smile1',
						'title' => ':-)',
						'next'  => 'begeleidingheefttoegevoegdewaardevraag',
					),
					array(
						'id'	=> 'optie_smile2',
						'title' => ':-D',
						'next'  => 'begeleidingheefttoegevoegdewaardevraag',
					),
				),
			),
			array(
				'id'    => 'begeleidingheefttoegevoegdewaardevraag',
				'title' => 'NJOYER, Wat is voor jou de toegevoegde waarde van mijn begeleiding? En heb je nog tips?',
				'next'  => 'bedanktvooralles',
			),
			array(
				'id'    => 'begeleidingstips',
				'title' => 'Hoe kan mijn begeleiding verbeterd worden? <br/> Ik wil graag van toegevoegde waarde zijn!',
				'next'  => 'bedanktvooralles',
			),	
			array(
				'id'    => 'bedanktvooralles',
				'title' => 'Bedankt, NJOYER! Dat is het voor nu. <br/> Je kunt je bijdrage nu publiceren. <br/> Tot de volgende keer!',
			),
*/
/*
			array(
				'id'    => 'extravragenvraag',
				'title' => 'Mag ik je nog een vraag stellen NJOYER?',
				'options' => array(
					array(
						'id'	=> 'optie_extravragenstellen_ja',
						'title' => 'Ja',
						'next'  => 'communitybijdragebeoordeling',
					),
					array(
						'id'	=> 'optie_extravragenstellen_nee',
						'title' => 'Nee',
						'next'  => 'einde',
					),
				),
			),
			array(
				'id'    => 'mophoren1',
				'title' => 'Wil je nog een mop horen?',
				'options' => array(
					array(
						'id'	=> 'optie_mophoren1_ja',
						'title' => 'Ja! Leuk!',
						'next'  => 'mop1',
					),
					array(
						'id'	=> 'optie_mophoren1_nee',
						'title' => 'Laat maar...',
						'next'  => 'einde',
					),
				),
			),
			array(
				'id'    => 'mop1',
				'title' => 'Vroeger was ik een twijfelaar. Maar daar ben ik nu niet meer zo zeker van. ;-p',
				'placeholder' => 'En jij?',
				'next'  => 'mophoren1_feedback',
			),
			array(
				'id'    => 'mophoren1_feedback',
				'title' => 'Hoe vind je de mop?',
				'options' => array(
					array(
						'id'	=> 'optie_mophoren1_ja',
						'title' => 'Leuk!',
						'next'  => 'mop1leuk',
					),
					array(
						'id'	=> 'optie_mophoren1_nee',
						'title' => 'Ik ken betere!',
						'next'  => 'beteremop1',
					),
				),
			),
			array(
				'id'    => 'mop1leuk',
				'title' => 'Dat vind ik fijn om te horen! Ken jij ook een leuke mop?',
				'placeholder' => 'Typ hier je mop... of klik op Volgende als je de mop liever later een keer deelt!',
				'next'  => 'einde',
			),
			array(
				'id'    => 'beteremop1',
				'title' => 'Leuk dat je betere moppen kent! Ik hoor graag nieuwe moppen!',
				'placeholder' => 'Typ hier je mop... of klik op Volgende als je de mop liever later deelt!',
				'next'  => 'einde',
			),	
*/	
		);
	}

	public function getName( $id ) {
		$name = sprintf( '_respect_%s', $id );

		return $name;
	}

	public function enqueue_scripts() {
		// @see https://developer.wordpress.org/reference/functions/wp_register_script/
		wp_register_script(
			'respect',
			plugins_url( 'script.js', __FILE__ ),
			'jquery',
			'0.1.0',
			true
		);

		wp_enqueue_script( 'respect' );
	}

	function comment_default_fields( $fields ) {

		$plugin_url_path = WP_PLUGIN_URL;

		echo '<LINK href="'. $plugin_url_path . '/Respect/style.css" rel="stylesheet" type="text/css">';
		echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js"></script>';

		$commenter = wp_get_current_commenter();
		$req = get_option( 'require_name_email' );
		$aria_req = ( $req ? " aria-required='true'" : '' );

		$fields[ 'author' ] = '<p class="comment-form-author respect-comment-question">
						<img width="60" height="60" 
						src="'. $plugin_url_path . '/Respect/images/Spector/Spector_Alfalfa.png" 
						class="spector-profilepicture" 
						alt="Spector" 
						itemprop="profielfoto">
						<label class="spectortext" for="author">' . __( 'Hoi! Welkom! Ik heet Spector. 
						<br/> Ik stel graag behulpzame vragen om te zorgen voor meer toegevoegde waarde! 
						<br/> Hoe heet jij?' ) . '<span class="required">*</span></label>
						<input id="author" name="author" class="respectveld standaardverplicht" type="text" 
						value="'. esc_attr( $commenter['comment_author'] ) .'" size="30" tabindex="1"' . $aria_req . ' />
		  				<input type="button" class="author-respect-next respect-next" name="author-respect-next" value="Volgende >" />
		  				</p>';

		$fields[ 'email' ] = '<p class="comment-form-email respect-comment-question">
						<img width="60" height="60" 
						src="'. $plugin_url_path . '/Respect/images/Spector/Spector_Alfalfa.png" 
						class="spector-profilepicture" 
						alt="Spector" 
						itemprop="profielfoto">
						<label class="spectortext" for="email">'. __( 'Wat is je E-mail adres? Ik hou het voor mezelf.' ) .'
						<span class="required">*</span></label>
						<input id="email" name="email" type="text" class="respectveld standaardverplicht" 
						value="'. esc_attr( $commenter['comment_author_email'] ) .'" size="30"  tabindex="2"' . $aria_req . ' />
		  				<input type="button" class="email-respect-next respect-next" name="email-respect-next" value="Volgende >" />
		  		  		</p>';

/*
		$fields[ 'url' ] = '<p class="comment-form-url">'.
		  '<img width="60" height="60" 
						src="'. $plugin_url_path . '/Respect/images/Spector/Spector_Alfalfa.png" 
						class="spector-profilepicture" 
						alt="Spector" 
						itemprop="profielfoto">
						<label for="url">' . __( 'Website' ) . '</label>'.
		  '<input id="url" name="url" type="text" value="'. esc_attr( $commenter['comment_author_url'] ) .
		  '" size="30"  tabindex="3" /></p>';

		$fields[ 'phone' ] = '<p class="comment-form-phone">'.
		  '<img width="60" height="60" 
						src="'. $plugin_url_path . '/Respect/images/Spector/Spector_Alfalfa.png" 
						class="spector-profilepicture" 
						alt="Spector" 
						itemprop="profielfoto">
						<label for="phone">' . __( 'phone' ) . '</label>'.
		  '<input id="phone" name="phone" type="text" size="30"  tabindex="4" /></p>';
*/

	  return $fields;
	}

	function additional_fields() {

		$plugin_url_path = WP_PLUGIN_URL;

		echo '<div id="respect-comment">';

		foreach( $this->questions as $question ) {
			if ( ! isset( $question['next'] ) ) {
				$question['next'] = '';
			}
			if ( ! isset( $question['placeholder'] ) ) {
				$question['placeholder'] = '';
			}

			if ( isset($question['options']) ) {
				printf( '<div class="respect-onderdeel">
						<p id="%1$s" class="respect-comment-question">
						<img width="60" height="60" 
						src="'. $plugin_url_path . '/Respect/images/Spector/Spector_Alfalfa.png" 
						class="spector-profilepicture" 
						alt="Spector" 
						itemprop="profielfoto">
						<label for="respect-field-'. $question['id'] .'" class="spectortext">' . __( '%2$s' ) . ' </label>
						<span class="clearboth"></span>',
						$question['id'],
						$question['title']
	  			);			
	  			
  				foreach ( $question['options'] as $key => $option ) {
	  				
				    echo '<input id="respect-field-'. $question['id'] .'-'.$key.'"
				    		name="'. $this->getName( $question['id'] ) .'"
							data-respect-next="'. $option['next'] .'"
							class="respectoptie"
							type="radio" tabindex="5" value="'. $option['title'] .'" />
							<label for="respect-field-'. $question['id'] .'-'.$key.'" class="respectoption">
							'. $option['title'] .'</label>';
				}
				echo '</p></div>';
			} else {
				printf( '<div class="respect-onderdeel"><p id="%1$s" class="respect-comment-question">
						<img width="60" height="60" 
						src="'. $plugin_url_path . '/Respect/images/Spector/Spector_Alfalfa.png" 
						class="spector-profilepicture" 
						alt="Spector" 
						itemprop="profielfoto">
						<label for="respect-field-%1$s" class="spectortext">'. __( '%3$s' ) .'</label><br/>
						<span class="clearboth"></span>
						<textarea id="respect-field-%1$s" name="%2$s" data-respect-next="%4$s"
						placeholder="'. $question['placeholder'] .'"
						class="respectveld"
						type="text" size="50"  tabindex="5" ></textarea>
						<span class="bubble"></span>
						</p></div>',
						$question['id'],
						$this->getName( $question['id'] ),
						$question['title'],
						$question['next']
	  			);
			}			
  		}
		echo '<input type="button" id="respect-next" name="respect-next" value="Volgende >" />';
  		echo '</div>';
	}

/*
						<input id="respect-field-%1$s" name="%2$s" data-respect-next="%4$s"
						placeholder="'. $question['placeholder'] .'"
						class="respectveld"
						type="text" size="50"  tabindex="5" />
*/


	function save_comment_meta( $comment_id ) {

		foreach( $this->questions as $question ) {
			$name = $this->getName( $question['id'] );

			if ( filter_has_var( INPUT_POST, $name ) && '' !== $_POST[ $name ] ) {
				$value = filter_input( INPUT_POST, $name, FILTER_SANITIZE_STRING );

				$field = wp_filter_nohtml_kses( $value );

				add_comment_meta( $comment_id, $name, $field );
			}
		}

	}

	function verify_comment_meta( $commentdata ) {
/*
		foreach( $this->questions as $question ) {
			$name = $this->getName( $question['id'] );

			if ( ! filter_has_var( INPUT_POST, $name ) ) {
				echo 'Inspect: Je hebt nog niet alles ingevuld. Klik op de terugknop en denk er nog eens over na.';

				printf(
					'Je hebt %s nog niet ingevuld',
					$question['title']
				);

				wp_die( __( 'Denk er nog maar even over na...' ) );    
			}
		}
*/

		return $commentdata;
	}

	function modify_comment( $text ){

		$plugin_url_path = WP_PLUGIN_URL;

		$content = array();

		foreach( $this->questions as $question ) {
			$field = get_comment_meta( get_comment_ID(), $this->getName( $question['id'] ), true );
		
			if ( $field ) {
				if ( isset( $question['kopje'] ) ) {
					$content[] = 	'<p><i>' . $question['kopje'] . '</i><br/>
									'. esc_attr( $field ) .'<br/></p>';
				}
			}					
		}

		return implode( '', $content ) . $text;
	}

	function comment_meta_boxes() {
		add_meta_box(
			'title',
			__( 'Respect' ),
			array( $this, 'comment_meta_box' ),
			'comment',
			'normal',
			'high'
		);
	}

	function comment_meta_box ( $comment ) {

		foreach( $this->questions as $question ) {
			$field = get_comment_meta( $comment->comment_ID, $this->getName( $question['id'] ), true );
			
			printf( '<p>
					<label for="%1$s">%2$s</label>
					<input type="text" name="%1$s" value="'. esc_attr( $field ) .'" class="widefat" />
					</p>',
						$question['id'],
						$question['title']
			);
		}

		wp_nonce_field( 'extend_comment_update', 'extend_comment_update', false );
	}

	function extend_comment_edit_metafields( $comment_id ) {
		if( ! isset( $_POST['extend_comment_update'] ) || ! wp_verify_nonce( $_POST['extend_comment_update'], 'extend_comment_update' ) ) return;

	  if ( ( isset( $_POST['phone'] ) ) && ( $_POST['phone'] != '') ) :
	  $phone = wp_filter_nohtml_kses($_POST['phone']);
	  update_comment_meta( $comment_id, 'phone', $phone );
	  else :
	  delete_comment_meta( $comment_id, 'phone');
	  endif;

	  	foreach( $this->questions as $question ) {
			$name = $this->getName( $question['id'] );

			if ( ! filter_has_var( INPUT_POST, $name ) ) {
				$field = wp_filter_nohtml_kses($_POST[$question['id']]);
				update_comment_meta( $comment_id, $name, $field );
			} else {
				delete_comment_meta( $comment_id, $name );
			}
			
		}

/*
	  if ( ( isset( $_POST['hoed1'] ) ) && ( $_POST['hoed1'] != '') ):
	  $hoed1 = wp_filter_nohtml_kses($_POST['hoed1']);
	  update_comment_meta( $comment_id, 'hoed1', $hoed1 );
	  else :
	  delete_comment_meta( $comment_id, 'hoed1');
	  endif;

	  if ( ( isset( $_POST['hoed2'] ) ) && ( $_POST['hoed2'] != '') ):
	  $hoed2 = wp_filter_nohtml_kses($_POST['hoed2']);
	  update_comment_meta( $comment_id, 'hoed2', $hoed2 );
	  else :
	  delete_comment_meta( $comment_id, 'hoed2');
	  endif;
*/

	}

}

$respectComments = new RespectComments();
