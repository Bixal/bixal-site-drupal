<?php

/**
 * @file
 * Preprocess function for content.
 */

/**
 * Implements hook_preprocess_HOOK().
 */
function bixal_uswds_preprocess_sitewide_alert(&$variables): void {
  $variables['slim'] = (bool) $variables['sitewide_alert']->get('field_slim')->getString();
  $variables['no_icon'] = (bool) $variables['sitewide_alert']->get('field_no_icon')->getString();
  $variables['style'] = $variables['sitewide_alert']->get('style')->getString();
  $variables['heading'] = $variables['sitewide_alert']->get('field_heading')->getString();
}
