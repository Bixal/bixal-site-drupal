<?php

/**
 * @file
 * Preprocess functions for pages.
 */

use Drupal\Core\Url;
use Drupal\node\NodeInterface;

/**
 * Get the URL of a storybook icon.
 *
 * @param string $file_name_or_icon_name
 *   Either the name (facebook) or file name (facebook.svg) of an SB icon.
 *
 * @return \Drupal\Core\Url
 *   A Drupal Url.
 */
function _bixal_uswds_get_storybook_icon_file_url(string $file_name_or_icon_name): Url {
  if (!str_ends_with($file_name_or_icon_name, '.svg')) {
    $file_name_or_icon_name .= '.svg';
  }
  return Url::fromUri("base://icons/$file_name_or_icon_name");
}

/**
 * Implements hook_preprocess_page().
 */
function bixal_uswds_preprocess_page(&$vars) {
  $vars['header'] = [
    '#theme' => 'site_wrapper_header',
  ];
  // Define the node.
  $node = \Drupal::routeMatch()->getParameter('node');
  // Add the module handler service.
  $moduleHandler = \Drupal::service('module_handler');
  // Load the site name from configuration.
  $config = \Drupal::config('system.site');

  // If twig_tweak is installed and enabled.
  if ($moduleHandler->moduleExists('twig_tweak')) {
    $vars['twig_tweak_enabled'] = TRUE;
  }

  // Set a var for the sitename.
  $vars['site_name'] = $config->get('name');

  // Check for a node instance.
  if ($node instanceof NodeInterface) {
    // If the page has a hero, unset the page
    // title as the hero will have a h1 tag.
    if (
      $node->hasField('field_bx_hero') &&
      !$node->get('field_bx_hero')->isEmpty()
    ) {
      unset($vars['page']['help']['bixal_uswds_page_title']);
    }
  }
  $vars['footer'] = [
    '#theme' => 'site_wrapper_footer',
  ];

  // Show the contact form in the footer if:
  // * The env variable is set
  // * The current page is not /contact.
  $vars['show_contact_form_in_footer'] = getenv('SHOW_CONTACT_FORM_IN_FOOTER') && \Drupal::routeMatch()->getRouteName() !== 'contact.site_page';

  // Most pages have titles in the templates, some do not.
  if (in_array(\Drupal::routeMatch()->getRouteName(), [
    'cookies.cookies_documentation',
    'user.login',
  ])) {
    $vars['add_section_wrapper'] = TRUE;
  }
}
