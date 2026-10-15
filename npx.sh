#!/usr/bin/env bash

# Runs npx the same way npm.sh runs npm: through ddev unless .npm.env says
# local, and records any package-lock.json change in npm.log.
NPM_WRAPPER_TOOL=npx exec "$(dirname "$0")/npm.sh" "$@"
