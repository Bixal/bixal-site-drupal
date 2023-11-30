#!/usr/bin/env bash

# Post deploy hook is NOT called locally (on Lando).
# Exit the hook on any failure and show execution.
set -ex

# Clear the post deploy log.
echo "" > /var/log/post-deploy.log

echo "Environment Type: ${PLATFORM_ENVIRONMENT_TYPE}"
./orch/post_deploy_shared.sh

echo 'POST DEPLOY LOG:'
tail -n100 /var/log/post-deploy.log

