<?php

/**
 * @file
 * Print the config sync directory and every config split's folder.
 *
 * Run with: ./drush.sh php:script RoboEnv/scripts/config-dirs.php
 *
 * One path per line, relative to the project root, so they work on the host
 * even when drush runs in a container. Splits stored in the database have no
 * folder and are skipped.
 */

use Drupal\Core\Site\Settings;
use Drush\Drush;
use Symfony\Component\Filesystem\Path;

$root = Drush::bootstrapManager()->getComposerRoot();
$dirs = [Settings::get('config_sync_directory')];
foreach (\Drupal::entityTypeManager()->getStorage('config_split')->loadMultiple() as $split) {
  $dirs[] = $split->get('folder');
}
foreach (array_filter($dirs) as $dir) {
  echo Path::makeRelative(Path::makeAbsolute($dir, DRUPAL_ROOT), $root), PHP_EOL;
}
