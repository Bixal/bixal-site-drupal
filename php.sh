#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

# Set a default BIN_PATH_PHP for remote or local environments.
# They won't have a .php.env, but they can set this env variable
# if php is not in the path.
if [ -z "$BIN_PATH_PHP" ]; then
  BIN_PATH_PHP="php"
fi

# Remote and local environments will have these env variables set.
if [ -z "$DRUPAL_ENV_LOCAL" ] && [ -z "$DRUPAL_ENV_REMOTE" ]; then
  # Allow local machine to choose php path interactively.
  if [ ! -f .php.env ]; then
    echo ""
    echo "PHP must be installed locally."
    echo ""
    echo "Possible PHP paths to use:"
    whereis php
    echo ""
    echo "The following is the default version of PHP in your \$PATH. If PHP is already in your path and you want to use that version, just hit enter."
    which php
    echo ""
    read -p "Please enter the path to PHP on your local machine: " custom_php_path
    default_php_path=$(which php)
    custom_php_path=${custom_php_path:-$default_php_path}
    if ! builtin command -v $custom_php_path > /dev/null; then
      echo "The path '$custom_php_path' does not exist"
      exit 1
    fi
    echo ""
    echo "You entered: $custom_php_path. This value will be written to .php.env, you can update the value at any time or delete the file to get this prompt again."
    echo ""
    echo "Your PHP version is:"
    $custom_php_path --version
    echo ""
    echo "BIN_PATH_PHP=\"$custom_php_path\"" > .php.env
  fi
  . .php.env
fi

if ! builtin command -v $BIN_PATH_PHP > /dev/null; then
  echo "PHP could not be found at the path '$BIN_PATH_PHP'. Please enter the environment variable BIN_PATH_PHP in .php.env or before this script is called."
  exit 1
fi
set -x
${BIN_PATH_PHP} "$@"
