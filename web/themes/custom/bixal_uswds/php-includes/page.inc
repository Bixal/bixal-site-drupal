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
  $vars['socialNav'] = [
    'variant' => NULL,
    'aria_label' => t('Social links'),
    'items' => [
      [
        "href" => "https://www.linkedIn.com/company/bixa",
        "label" => t("LinkedIn"),
        "icon_path" => _bixal_uswds_get_storybook_icon_file_url('linkedin.svg')->toString(),
      ],
      [
        "href" => "https://www.facebook.com/bixal",
        "label" => t("Facebook"),
        "icon_path" => _bixal_uswds_get_storybook_icon_file_url('facebook.svg')->toString(),
      ],
      [
        "href" => "https://www.twitter.com/bixal",
        "label" => t("Twitter"),
        "icon_path" => _bixal_uswds_get_storybook_icon_file_url('twitter.svg')->toString(),
      ],
    ],
  ];
}
