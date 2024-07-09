<?php

// phpcs:ignoreFile

/**
 * Location of the site configuration files.
 *
 * The $settings['config_sync_directory'] specifies the location of file system
 * directory used for syncing configuration data. On install, the directory is
 * created. This is used for configuration imports.
 *
 * The default location for this directory is inside a randomly-named
 * directory in the public files path. The setting below allows you to set
 * its location.
 */
$settings['config_sync_directory'] = '../config/sync';

/**
 * Salt for one-time login links, cancel links, form tokens, etc.
 *
 * This variable will be set to a random value by the installer. All one-time
 * login links will be invalidated if the value is changed. Note that if your
 * site is deployed on a cluster of web servers, you must ensure that this
 * variable has the same value on each server.
 *
 * For enhanced security, you may set this variable to the contents of a file
 * outside your document root, and vary the value across environments (like
 * production and development); you should also ensure that this file is not
 * stored with backups of your database.
 *
 * Example:
 * @code
 *   $settings['hash_salt'] = file_get_contents('/home/example/salt.txt');
 * @endcode
 */
// More secure, create a per environment salt so that you can't do things like
// create a prod one-time login link from a local.
if (getenv('DRUPAL_HASH_SALT') !== FALSE) {
  $settings['hash_salt'] = getenv('DRUPAL_HASH_SALT');
}
// Use a shared hash salt that is unique to this site.
// This is hash salt is created by prescaffolding of DrupalEnv.
elseif (file_exists('../drupal_hash_salt.txt')) {
  $settings['hash_salt'] = trim(file_get_contents('../drupal_hash_salt.txt'));
}
// If there is no hash salt, Drupal will throw an error when cache is cleared
// before a site is installed. This will cause site install to edit settings.php
// and set a salt there. However, it will also write the DB credentials which
// are already set, which is annoying and should be reverted.
if (empty($settings['hash_salt']) && PHP_SAPI === 'cli' && ($GLOBALS['argv'][1] ?? '') === 'cr') {
  $settings['hash_salt'] = 'this_will_be_set_during_site_install';
}

/**
 * Load configuration for the environment.
 */
if (getenv('LANDO_INFO') !== FALSE) {
  include $app_root . '/' . $site_path . '/settings.lando.php';
}
elseif (getenv('PLATFORM_ENVIRONMENT_TYPE') !== FALSE) {
  include $app_root . '/' . $site_path . '/settings.platformsh.php';
}

/**
 * Load local development override configuration, if available.
 *
 * Create a settings.local.php file to override variables on secondary (staging,
 * development, etc.) installations of this site.
 *
 * Typical uses of settings.local.php include:
 * - Disabling caching.
 * - Disabling JavaScript/CSS compression.
 * - Rerouting outgoing emails.
 *
 * Keep this code block at the end of this file to take full effect.
 */
// Create the settings.local.php from updated.settings.local.php if
// settings.local.php does not exist yet and this is a local environment.
if (getenv('DRUPAL_ENV_LOCAL') !== FALSE) {
  $settings_local_php = $app_root . '/' . $site_path . '/settings.local.php';
  if (!file_exists($settings_local_php)) {
    copy(DRUPAL_ROOT . '/sites/updated.settings.local.php', $settings_local_php);
  }
  include $settings_local_php;
}
