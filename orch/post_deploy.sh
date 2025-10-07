#!/usr/bin/env bash

set -e

./orch/show_file.sh $0

# Normally, XDEBUG_MODE=debug,develop but develop breaks the Drupal installation.
# https://www.drupal.org/project/drupal/issues/3405976.
if [ -n "$XDEBUG_MODE" ]; then
  export XDEBUG_MODE=debug
fi
if [ -n "$(drush status --fields=bootstrap)" ]; then
  echo "Drupal is installed, continuing."
  echo "Running Core Cron"
  drush core-cron
  # If Search API is enabled.
  if [ -n "$(drush pm-list --type=module --status=enabled --no-core | grep search_api)" ]; then
    # Make the site hash consistent so there isn't random records floating around.
    if [ -n "$(drush pm-list --type=module --status=enabled --no-core | grep search_api_solr)" ] && [ -n "${DRUPAL_SOLR_SITE_HASH}" ]; then
      drush state-set search_api_solr.site_hash "${DRUPAL_SOLR_SITE_HASH}"
    fi
    echo "Re-indexing Search API"
    drush search-api-reindex
    drush search-api:index
  fi
  # Handy if you have test users that are persistent.
  #if [ "${PLATFORM_ENVIRONMENT_TYPE}" != "production" ]; then
  #  echo 'Unblock testing users on non-prod environments.'
  #  drush user:unblock site-administrator,publisher,editor,author
  #  echo "Update user 1's password to the non-prod version"
  #  drush user:password admin admin
  #fi
else
  echo "Drupal is not installed, this should not be the case in post deploy."
fi

./orch/show_file.sh $0 end
