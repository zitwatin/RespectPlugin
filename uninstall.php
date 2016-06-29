<?php
/*
Plugin Name: Uninstall Respect - Spector release
Version: 1.04
Plugin URI: https://zitwatin.wordpress.com/2016/03/25/aanleiding/
Description: Verwijdert Respect - De data blijft bewaart in deze versie
Author: Andrew van Ingen
Author URI: http://www.zitwat.in
Implementation: Andrew van Ingen @andrewvaningen
*/

if( !defined( 'ABSPATH') && !defined('WP_UNINSTALL_PLUGIN') )
    exit();

  $comments = get_comments();
  foreach($comments as $comment) {
//     delete_comment_meta($comment->comment_ID, 'phone');
//     delete_comment_meta($comment->comment_ID, 'title');
//     delete_comment_meta($comment->comment_ID, 'hoed1');
//     delete_comment_meta($comment->comment_ID, 'hoed2');
//     delete_comment_meta($comment->comment_ID, 'rating');
  }
