#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

# If the .env file exists. use it to populate BIN_PATH_PHP.
if [ -f .env ]; then
  . .env
fi

# If there is no path to php override, use lando.
if [ -z "${BIN_PATH_PHP}" ]; then
  BIN_PATH_PHP="lando php"
else
  set -x
fi

${BIN_PATH_PHP} "$@"
