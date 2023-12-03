<?php

/**
 * @file
 * Configure settings.php for lando.
 */

use Drupal\Core\Installer\InstallerKernel;

$lando_info = json_decode(getenv('LANDO_INFO'));
// Lando DB connection.
$databases['default']['default'] = array (
  'database' => $lando_info->database->creds->database,
  'username' => $lando_info->database->creds->user,
  'password' => $lando_info->database->creds->password,
  'prefix' => '',
  'host' => $lando_info->database->internal_connection->host,
  'port' => $lando_info->database->internal_connection->port,
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);

/**
 * Redis Configuration.
 *
 * See the README.md from the drupal redis module for more info.
 */
if (!InstallerKernel::installationAttempted() && extension_loaded('redis') && class_exists('Drupal\redis\ClientFactory')) {
  $settings['redis.connection']['interface'] = 'PhpRedis'; // Can be "Predis".
  $settings['redis.connection']['host'] = 'cache';  // Your Redis instance hostname, corresponds to the lando service name.
  # Use for all bins otherwise specified.
  $settings['cache']['default'] = 'cache.backend.redis';
}
