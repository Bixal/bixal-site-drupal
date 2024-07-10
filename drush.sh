#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

drush_path=$(./php.sh vendor/bin/robo common:drush-path)
if [[ $drush_path = '' ]]; then
  echo "Drush is not available, your drupal environment has not been initialized yet."
  exit 1
fi
if ! builtin command -v $drush_path > /dev/null; then
  echo "The drush path '$drush_path' does not exist."
  exit 1
fi
set -x
$drush_path "$@"
