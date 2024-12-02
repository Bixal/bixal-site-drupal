<?php

use Drupal\Core\Installer\InstallerKernel;

if (
  !InstallerKernel::installationAttempted() &&
  (extension_loaded('memcached') || extension_loaded('memcache')) &&
  file_exists($app_root . '/modules/contrib/memcache')
) {
  /**
   * Apply Memcache cache settings.
   *
   * Drush can be bootstrap Drupal twice, this should be safe to be called
   * multiple times.
   *
   * @param array $settings
   *   The $settings array from settings.php.
   * @param string $host
   *   The host that Memcache will be contacted on.
   *
   * @return void
   */
  function _drupal_env_settings_memcache(array &$settings, string $host): void {
    $settings['memcache']['servers'][$host] = 'default';

    // Use for all bins otherwise specified.
    $settings['cache']['default'] = 'cache.backend.memcache';

    /* Optional settings:

    Apply changes to the container configuration to better leverage Memcache.
    This includes using Memcache for the lock and flood control systems, as well
    as the cache tag checksum. Alternatively, copy the contents of that file
    to your project-specific services.yml file, modify as appropriate, and
    remove this line. */
    $settings['container_yamls'][] = 'modules/contrib/memcache/example.services.yml';

    // Allow the services to work before the Memcache module itself is enabled.
    $settings['container_yamls'][] = 'modules/contrib/memcache/memcache.services.yml';

    // Use Memcache for container cache.
    // The container cache is used to load the container definition itself, and
    // thus any configuration stored in the container itself is not available
    // yet. These lines force the container cache to use Memcache rather than the
    // default SQL cache.
    require 'settings.memcache.container_pure.php';
  }

  // These only need to be done once, then they are included and applied always.
  // Manually add the classloader path, this is required for the container cache bin definition below
  // and allows to use it without the Memcache module being enabled.
  $class_loader->addPsr4('Drupal\\memcache\\', 'modules/contrib/memcache/src');
}
