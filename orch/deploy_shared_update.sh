#!/usr/bin/env bash

set -e

./orch/show_file.sh $0

# Drupal must be installed to update it.
if [ -n "$(drush status --fields=bootstrap)" ]; then
  echo "Ensure site is up to date from code"
  drush deploy
  # Required if config splits is enabled.
  if [ drush pm-list --type=module --status=enabled --no-core | grep 'config_split' ] && [ -n "$(ls $(drush php:eval "echo realpath(Drupal\Core\Site\Settings::get('config_sync_directory'));")/*.yml 2>/dev/null)" ] ); then
    drush cr
    drush cim -y
  fi
else
  echo "Drupal is not installed, cannot update. Installing instead"
  ./orch/deploy_install.sh
fi

./orch/show_file.sh $0 end
