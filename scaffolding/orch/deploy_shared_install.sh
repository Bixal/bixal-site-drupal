#!/usr/bin/env bash

set -x

drush cr
if [ -n "$(ls $(drush php:eval "echo realpath(Drupal\Core\Site\Settings::get('config_sync_directory'));")/*.yml 2>/dev/null)" ]; then
  echo "Installing a fresh Drupal site from configuration"
  drush si -y --account-pass='admin' --existing-config minimal
  # Required if config splits is enabled.
  if drush pm-list --type=module --status=enabled --no-core | grep 'config_split'; then
    drush cr
    drush cim -y
  fi
else
  echo "Installing a fresh Drupal site without configuration"
  drush si -y --account-pass='admin' minimal
fi

# Do additional tasks for a fresh install if needed.
#drush set-hp
