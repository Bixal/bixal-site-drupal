#!/usr/bin/env bash

set -e

./orch/show_file.sh $0

if [ "$COMPOSER_DEV" -eq 0 ]; then
    composer install --no-interaction --no-dev
elif [ "$COMPOSER_DEV" -eq 1 ]; then
    composer install --no-interaction
else
    echo "Env variable COMPOSER_DEV must be set when build.sh is run. 1 to install dev dependencies and 0 not to install dev dependencies."
    exit 1
fi

# TODO: Add in support for incremental DB backups with cron and s3.
#if [ ! -z "$AWS_ACCESS_KEY_ID" ] && [ ! -z "$AWS_SECRET_ACCESS_KEY" ]; then
#    pip install futures
#    pip install awscli --upgrade --user 2>/dev/null
#fi

./orch/show_file.sh $0 end
