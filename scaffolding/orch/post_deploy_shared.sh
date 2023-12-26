#!/usr/bin/env bash

set -x

if [ -n "$(drush status --fields=bootstrap)" ]; then
  echo "Drupal is installed, continuing."
  drush core-cron
  # If Solr is on.
  if [ -n "$(drush pm-list --type=module --status=enabled --no-core | grep search_api_solr)" ]; then
    # Make the site hash consistent so there isn't random records floating around.
    if [ -z "${LANDO_INFO}" ]; then
      drush sset search_api_solr.site_hash 6ddu2u
    fi
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

