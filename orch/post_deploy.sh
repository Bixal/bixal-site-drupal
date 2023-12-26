#!/usr/bin/env bash

set -e

./orch/show_file.sh $0

# Clear the post deploy log.
echo "" > /var/log/post-deploy.log

echo "Environment Type: ${PLATFORM_ENVIRONMENT_TYPE}"
./orch/post_deploy_shared.sh

echo 'POST DEPLOY LOG:'
tail -n100 /var/log/post-deploy.log

./orch/show_file.sh $0 end
