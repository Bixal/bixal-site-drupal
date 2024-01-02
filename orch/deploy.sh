#!/usr/bin/env bash

set -e

./orch/show_file.sh $0

# Clear the deploy log.
echo "" > /var/log/deploy.log

# Allow Drush to work on Platform.
php ./orch/deploy_generate_drush_yml.php

echo "Relevant environment variables and their values:"
echo ""
echo "PLATFORM_ENVIRONMENT_TYPE: ${PLATFORM_ENVIRONMENT_TYPE}"

set -x
# On production and staging environments, the site is just updated.
if ( [ "${PLATFORM_ENVIRONMENT_TYPE}" == "production" ] || [ "${PLATFORM_ENVIRONMENT_TYPE}" == "staging" ] ); then
  ./orch/deploy_shared_update.sh
else
  ./orch/deploy_shared_install.sh
fi

echo 'DEPLOY LOG:'
tail -n100 /var/log/deploy.log

./orch/show_file.sh $0 end
