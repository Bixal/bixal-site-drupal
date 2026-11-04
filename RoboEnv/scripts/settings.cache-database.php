<?php

/**
 * @file
 * Cache in the database while ./robo.sh config:update-capture runs.
 *
 * Appended to the end of settings.local.php, after any Redis or memcache
 * settings, and removed when the capture finishes or is aborted. Database
 * backups then restore their cache too, whatever cache backend the site
 * normally uses.
 */

$settings['cache'] = [
  'default' => 'cache.backend.database',
  // Otherwise these are also cached in APCu, which is not restored with the
  // database and is shared by web requests.
  'bins' => [
    'bootstrap' => 'cache.backend.database',
    'config' => 'cache.backend.database',
    'discovery' => 'cache.backend.database',
  ],
];
// Redis and memcache use this to cache the container outside the database.
unset($settings['bootstrap_container_definition']);
// Service overrides from cache modules, such as the cache tag checksums, lock
// and flood services in redis/example.services.yml.
$settings['container_yamls'] = array_values(array_filter(
  $settings['container_yamls'] ?? [],
  fn($file) => !str_starts_with($file, 'modules/'),
));
