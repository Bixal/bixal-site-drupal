<?php

use Drupal\Core\Installer\InstallerKernel;

if ((
  !InstallerKernel::installationAttempted() &&
  extension_loaded('redis') &&
  class_exists('Drupal\redis\ClientFactory') &&
  !function_exists('_settings_redis')
)) {
  // These settings need to be applied multiple times, depending on how often
  // initialize is called, they need to be reapplied every time.
  function _settings_redis(array &$settings, string $host, string $port): void {
    $settings['redis.connection']['host'] = $host;
    $settings['redis.connection']['port'] = $port;
    $settings['redis.connection']['interface'] = 'PhpRedis'; // Can be "Predis".
    # Use for all bins otherwise specified.
    $settings['cache']['default'] = 'cache.backend.redis';

    // Optional settings:

    // Apply changes to the container configuration to better leverage Redis.
    // This includes using Redis for the lock and flood control systems, as well
    // as the cache tag checksum. Alternatively, copy the contents of that file
    // to your project-specific services.yml file, modify as appropriate, and
    // remove this line.
    $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';

    // Allow the services to work before the Redis module itself is enabled.
    $settings['container_yamls'][] = 'modules/contrib/redis/redis.services.yml';

    // Use redis for container cache.
    // The container cache is used to load the container definition itself, and
    // thus any configuration stored in the container itself is not available
    // yet. These lines force the container cache to use Redis rather than the
    // default SQL cache.
    require 'settings.redis.container.php';
  }

  // These only need to be done once, then they are included and applied always.

  // Manually add the classloader path, this is required for the container cache bin definition below
  // and allows to use it without the redis module being enabled.
  $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');

}
