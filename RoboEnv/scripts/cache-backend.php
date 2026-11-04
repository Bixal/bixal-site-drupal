<?php

/**
 * @file
 * Print the default cache backend, to check settings.cache-database.php works.
 *
 * Run with: ./drush.sh php:script RoboEnv/scripts/cache-backend.php
 *
 * Prints cache.backend.database once it is appended to settings.local.php.
 * Reads the settings rather than the cache class, which modules like
 * webprofiler wrap. Adds a note when the container is still cached elsewhere,
 * as Redis and memcache do.
 */

use Drupal\Core\Site\Settings;

echo Settings::get('cache')['default'] ?? '';
if (Settings::get('bootstrap_container_definition')) {
  echo ' with its own container cache';
}
