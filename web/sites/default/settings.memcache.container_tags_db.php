<?php

// Cache Container on bootstrap (with cache tags on database)
// By default Drupal starts the cache_container on the database, in order to
// override that you can use the following code on your settings.php file. Make
// sure that the $class_load->addPsr4 is pointing to the right location of
// memcache (in this case modules/contrib/memcache/src)

// In this mode, the database is still bootstrapped so that cache tag invalidation
// can be handled. If you want to avoid database bootstrap, see the container
// definition in the next section instead.

// Define custom bootstrap container definition to use Memcache for cache.container.
$settings['bootstrap_container_definition'] = [
  'parameters' => [],
  'services' => [
    'database' => [
      'class' => 'Drupal\Core\Database\Connection',
      'factory' => 'Drupal\Core\Database\Database::getConnection',
      'arguments' => ['default'],
    ],
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
    'memcache.backend.cache.container' => [
      'class' => 'Drupal\memcache\DrupalMemcacheInterface',
      'factory' => ['@memcache.factory', 'get'],
      'arguments' => ['container'],
    ],
    'cache_tags_provider.container' => [
      'class' => 'Drupal\Core\Cache\DatabaseCacheTagsChecksum',
      'arguments' => ['@database'],
    ],
    'cache.container' => [
      'class' => 'Drupal\memcache\MemcacheBackend',
      'arguments' => ['container', '@memcache.backend.cache.container', '@cache_tags_provider.container', '@memcache.timestamp.invalidator.bin'],
    ],
  ],
];
