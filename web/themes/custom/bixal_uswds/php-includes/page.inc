<?php

/**
 * @file
 * Preprocess functions for pages.
 */

use Drupal\Core\Url;
use Drupal\node\NodeInterface;

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
  // Provide the social icons for social-nav.html.twig which is
  // embedded in footer.html.twig.
  $icon_path = static function ($file_name) use ($vars) {
    $icons_path = $vars['directory'] . '/storybook_components/stories/assets/icons';
    return Url::fromUri('base://' . $icons_path . '/' . $file_name)->toString();
  };
  $vars['socialNav'] = [
    'variant' => NULL,
    'aria_label' => t('Social links'),
    'items' => [
      [
        "href" => "https://www.facebook.com/bixal",
        "label" => t("Facebook"),
        "icon_path" => $icon_path('facebook.svg'),
      ],
      [
        "href" => "https://www.twitter.com/bixal",
        "label" => t("Twitter"),
        "icon_path" => $icon_path('twitter.svg'),
      ],
      [
        "href" => "https://www.linkedIn.com/company/bixa",
        "label" => t("LinkedIn"),
        "icon_path" => $icon_path('linkedin.svg'),
      ],
      [
        "href" => "https://medium.com/bixal",
        "label" => t("Medium"),
        "icon_path" => $icon_path('medium.svg'),
      ],
    ],
  ];
}
