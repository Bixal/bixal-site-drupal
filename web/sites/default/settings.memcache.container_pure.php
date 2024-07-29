<?php

// Cache Container on bootstrap (pure memcache)
// By default Drupal starts the cache_container on the database, in order to
// override that you can use the following code on your settings.php file.
// Make sure that the $class_load->addPsr4 is pointing to the right location
// of memcache (in this case modules/contrib/memcache/src)

// For this mode to work correctly, you must be using the overridden cache_tags.invalidator.checksum service.
// See example.services.yml for the corresponding configuration.

// Define custom bootstrap container definition to use Memcache for cache.container.
$settings['bootstrap_container_definition'] = [
  'parameters' => [],
  'services' => [
    # Dependencies.
    'settings' => [
      'class' => 'Drupal\Core\Site\Settings',
      'factory' => 'Drupal\Core\Site\Settings::getInstance',
    ],
    'memcache.settings' => [
      'class' => 'Drupal\memcache\MemcacheSettings',
      'arguments' => ['@settings'],
    ],
    'memcache.factory' => [
      'class' => 'Drupal\memcache\Driver\MemcacheDriverFactory',
      'arguments' => ['@memcache.settings'],
    ],
    'memcache.timestamp.invalidator.bin' => [
      'class' => 'Drupal\memcache\Invalidator\MemcacheTimestampInvalidator',
      # Adjust tolerance factor as appropriate when not running memcache on localhost.
      'arguments' => ['@memcache.factory', 'memcache_bin_timestamps', 0.001],
    ],
    'memcache.timestamp.invalidator.tag' => [
      'class' => 'Drupal\memcache\Invalidator\MemcacheTimestampInvalidator',
      # Remember to update your main service definition in sync with this!
      # Adjust tolerance factor as appropriate when not running memcache on localhost.
      'arguments' => ['@memcache.factory', 'memcache_tag_timestamps', 0.001],
    ],
    'memcache.backend.cache.container' => [
      'class' => 'Drupal\memcache\DrupalMemcacheInterface',
      'factory' => ['@memcache.factory', 'get'],
      # Actual cache bin to use for the container cache.
      'arguments' => ['container'],
    ],
    # Define a custom cache tags invalidator for the bootstrap container.
    'cache_tags_provider.container' => [
      'class' => 'Drupal\memcache\Cache\TimestampCacheTagsChecksum',
      'arguments' => ['@memcache.timestamp.invalidator.tag'],
    ],
    'cache.container' => [
      'class' => 'Drupal\memcache\MemcacheBackend',
      'arguments' => ['container', '@memcache.backend.cache.container', '@cache_tags_provider.container', '@memcache.timestamp.invalidator.bin'],
    ],
  ],
];
