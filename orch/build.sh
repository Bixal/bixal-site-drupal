#!/usr/bin/env bash

# Exit the hook on any failure
set -e
# If this was not built on lando (local), then
if [ -z "${LANDO_INFO}" ]; then
  # Don't install dev dependencies remotely.
  composer install --no-interaction --no-dev

  # On Platform.sh, use a single container and install node 16 in it.
  # This broke for Mac users with VirtioFS:
  # https://github.com/docker/for-mac/issues/6277
  # Install the version specified in the .nvmrc file
  n auto

  # Reset the location hash to recognize the newly installed version
  hash -r
  # Finish setting node version.

  # Rebuild our front end dependencies and build assets.
  # Since remotely we are able to set a newer version of node IN the
  # PHP service, this command is run in the PHP service. Locally it is
  # run in a build step in lando.yml.
  ./orch/build_fe_shared.sh
else
  # Install with dev dependencies on locals.
  composer install --no-interaction
fi

# TODO: Add in support for incremental DB backups with cron and s3.
#if [ ! -z "$AWS_ACCESS_KEY_ID" ] && [ ! -z "$AWS_SECRET_ACCESS_KEY" ]; then
#    pip install futures
#    pip install awscli --upgrade --user 2>/dev/null
#fi
