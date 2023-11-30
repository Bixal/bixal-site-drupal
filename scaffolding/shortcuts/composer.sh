#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

# If the .env file exists, use it to populate BIN_PATH_COMPOSER.
if [ -f .env ]; then
  . .env
fi

# If this was run through 'lando composer'.
# BIN_PATH_COMPOSER can also be set with an 'env' property in tooling.
if [ -n "${LANDO_INFO}" ]; then
  BIN_PATH_COMPOSER="composer"
fi

EXIT_STATUS=0
if [ -n "${BIN_PATH_COMPOSER}" ]; then
  set -x
  ${BIN_PATH_COMPOSER} "$@" || EXIT_STATUS=$?
  set +x
else
  # If there is no path to composer override, use the composer binary in the working path of Lando.
  # Format the arguments within single quotes
  formatted_args=$(printf "'%s' " "$@")
  set -x
  lando ssh -c "composer $formatted_args" || EXIT_STATUS=$?
  set +x
fi

# Support MacOS and Linux.
# https://stackoverflow.com/questions/8996820/how-to-create-md5-hash-in-bash-in-mac-os-x/8996924#8996924
__rvm_md5_for()
{
  # Macos.
  if builtin command -v md5 > /dev/null; then
    echo "$1" | md5
  # Linux.
  elif builtin command -v md5sum > /dev/null ; then
    echo "$1" | md5sum | awk '{print $1}'
  else
    rvm_error "Neither md5 nor md5sum were found in the PATH"
    return 1
  fi

  return 0
}

# During the build process, the git repo is removed and a 'updated' will throw a
# warning, ensure there is a git repo first.
if [ "$(git rev-parse --is-inside-work-tree 2>/dev/null)" = "true" ]; then
  # If the composer.lock has been modified, then add the command used to composer.log
  updated=$(git diff --name-only composer.lock)
  if [[ -n $updated ]]; then
    # Create a hash of the diff of what's in composer.lock.
    temp_hash=$(git diff composer.lock)
    hash=$(__rvm_md5_for "$temp_hash")
    if [ ! -f composer.log ]; then
      touch composer.log
    fi
    # Look at the log file for the last hash of compose.lock that was created.
    last_hash=$(tail -1 composer.log | sed 's/|.*//')
    # If the stored hash of the last item is the same as the current diff hash,
    # then the command has already been recorded. The command given might not
    # even be the last command run, but the last_hash is based on the diff not the command.
    if [[ "$last_hash" = "$hash" ]]; then
      exit 0
    fi
    branch=$(git rev-parse --abbrev-ref HEAD)
    date=$(date)
    email=$(git config user.name)
    echo -e "$hash|$email|$branch|$date|./composer.sh $*" >> composer.log
  fi
fi

exit "${EXIT_STATUS}"
