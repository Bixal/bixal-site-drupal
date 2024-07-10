#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

# If the .env file exists. use it to populate BIN_PATH_ROBO_PHP.
if [ ! -f vendor/bin/robo ]; then
  echo 'You must install composer dependencies before robo can be run.'
  exit 1
fi
./php.sh vendor/bin/robo "$@"
