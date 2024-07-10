<?php

use Drupal\Core\Installer\InstallerKernel;

if ((
  !InstallerKernel::installationAttempted() &&
  (extension_loaded('memcached') || extension_loaded('memcache')) &&
  file_exists($app_root . '/modules/contrib/memcache')
)) {
  function _settings_memcache(array &$settings, string $host): void {
    $settings['memcache']['servers'][$host] = 'default';
  }

  # Use for all bins otherwise specified.
  $settings['cache']['default'] = 'cache.backend.memcache';

  // Optional settings:

  // Apply changes to the container configuration to better leverage Redis.
  // This includes using Memcache for the lock and flood control systems, as well
  // as the cache tag checksum. Alternatively, copy the contents of that file
  // to your project-specific services.yml file, modify as appropriate, and
  // remove this line.
  $settings['container_yamls'][] = 'modules/contrib/memcache/example.services.yml';

  // Allow the services to work before the Redis module itself is enabled.
  $settings['container_yamls'][] = 'modules/contrib/memcache/memcache.services.yml';

  // Manually add the classloader path, this is required for the container cache bin definition below
  // and allows to use it without the redis module being enabled.
  $class_loader->addPsr4('Drupal\\memcache\\', 'modules/contrib/memcache/src');

  require 'settings.memcache.container_pure.php';
}







