<?php

/**
 * @file
 * Configure settings.php for lando.
 */

$config['config_split.config_split.local']['status'] = TRUE;

$lando_info = json_decode(getenv('LANDO_INFO'));

if (isset($lando_info->database)) {
  $databases['default']['default'] = [
    'database' => $lando_info->database->creds->database,
    'username' => $lando_info->database->creds->user,
    'password' => $lando_info->database->creds->password,
    'prefix' => '',
    'host' => $lando_info->database->internal_connection->host,
    'port' => $lando_info->database->internal_connection->port,
  ];

  // Lando DB connection.
  switch ($lando_info->database->type) {
    case 'mysql';
    case 'drupal-mysql';
    case 'mariadb':
    case 'drupal-mariadb':
      $databases['default']['default'] += [
        'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
        'driver' => 'mysql',
      ];
      break;

    case 'postgres';
    case 'drupal-postgres';
      $databases['default']['default'] += [
        'namespace' => 'Drupal\\pgsql\\Driver\\Database\\pgsql',
        'driver' => 'pgsql',
      ];
      break;

    default:
      throw new \Exception('The Database type "' . $lando_info->database->type . "' is not automatically able to be configured.");
  }
}

if (isset($lando_info->cache->type)) {
  switch ($lando_info->cache->type) {
    case 'redis':
      require_once 'settings.redis.php';
      if (function_exists('_drupal_env_settings_redis')) {
        _drupal_env_settings_redis(
          $settings,
          $lando_info->cache->internal_connection->host,
          $lando_info->cache->internal_connection->port,
          'PhpRedis',
        );
      }
      break;

    case 'memcached':
      require_once 'settings.memcache.php';
      if (function_exists('_drupal_env_settings_memcache')) {
        $memcache_host = implode(':', (array) $lando_info->cache->internal_connection);
        _drupal_env_settings_memcache($settings, $memcache_host);
      }
      break;

    default:
      throw new \Exception('The Cache type "' . $lando_info->cache->type . "' is not automatically able to be configured.");

  }
}

if (isset($lando_info->search->type)) {
  switch ($lando_info->search->type) {
    case 'solr':
      $config['search_api.server.default_solr_server']['backend_config']['connector_config'] = [
        'core' => $lando_info->search->core,
        'path' => '',
        'host' => $lando_info->search->internal_connection->host,
        'port' => $lando_info->search->internal_connection->port,
      ];
      break;

    case 'elasticsearch':
      $config['search_api.server.default_elasticsearch_server']['backend_config']['connector_config']['url'] = sprintf(
        'http://%s:%d',
        $lando_info->search->internal_connection->host,
        $lando_info->search->internal_connection->port
      );
      break;

    default:
      throw new \Exception('The Search type "' . $lando_info->search->type . "' is not automatically able to be configured.");

  }
}
