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
    command="php"
    default_php_path=$(which "$command") || :
    if [ -n "$default_php_path" ]; then
      echo "Possible PHP paths to use:"

      # Run whereis and process the output
      whereis_output=$(whereis $command)

      # Split the output into its components
      IFS=' ' read -r -a components <<< "$whereis_output"

      # Print each component separately
      for component in "${components[@]}"; do
        if [[ "$component" == *":" ]]; then
          # This is the command name or category
          echo "$component"
        elif [[ "$component" =~ /\.* ]]; then
          # This is a file location
          echo "  Path: $component"
          echo "  Version: "`$component --version -v | head -n 1 | awk '/PHP/{print $2}'`
          echo ""
        fi
      done
      echo ""
      echo "The following is the default version of PHP in your \$PATH, hit enter to continue or enter an alternate if desired."
    else
      echo "It seems PHP is not installed locally, please install now and enter the path."
    fi
    # A valid path to PHP must be entered to continue.
    while true; do
      echo ""
      read -e -i "$default_php_path" -p "Please enter the path to PHP on your local machine: " custom_php_path
      echo ""
      custom_php_path=${custom_php_path:-$default_php_path}
      if [[ -z "$custom_php_path" || ! $(command -v $custom_php_path) ]]; then
        echo "The path '$custom_php_path' does not exist"
      else
        echo "You entered: $custom_php_path. This value will be written to .php.env, you can update the value at any time or delete the file to get this prompt again."
        echo ""
        echo "Your PHP version is:"
        $custom_php_path --version
        echo ""
        echo "BIN_PATH_PHP=\"$custom_php_path\"" > .php.env
        break;
      fi
    done
  fi
  . .php.env
fi

if ! builtin command -v $BIN_PATH_PHP > /dev/null; then
  echo "PHP could not be found at the path '$BIN_PATH_PHP'. Please enter the environment variable BIN_PATH_PHP in .php.env or before this script is called."
  exit 1
fi
set -x
${BIN_PATH_PHP} "$@"
