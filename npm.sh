#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

# Where npm runs from the host: "ddev" (default) or "local". Inside ddev or a
# remote environment npm always runs directly. The choice is stored in .npm.env,
# delete it to be asked again.
if [ -z "$NPM_RUN_IN" ] && [ -z "$DRUPAL_ENV_LOCAL" ] && [ -z "$DRUPAL_ENV_REMOTE" ]; then
  if [ ! -f .npm.env ]; then
    choice="ddev"
    if [ -t 0 ]; then
      echo ""
      echo "Run npm through ddev (recommended, matches the build) or on your local machine?"
      echo "Local npm must satisfy \"engines\" in package.json (see .nvmrc)."
      printf "Enter ddev or local [ddev]: "
      read -r choice
      choice=${choice:-ddev}
    fi
    if [[ "$choice" != "ddev" && "$choice" != "local" ]]; then
      echo "Invalid choice '$choice', expected ddev or local."
      exit 1
    fi
    echo "NPM_RUN_IN=\"$choice\"" > .npm.env
    echo "Wrote NPM_RUN_IN=\"$choice\" to .npm.env, edit or delete it to change."
    echo ""
  fi
  . .npm.env
fi

# npx.sh reuses this script by setting NPM_WRAPPER_TOOL=npx.
tool=${NPM_WRAPPER_TOOL:-npm}
if [[ "$tool" != "npm" && "$tool" != "npx" ]]; then
  echo "Unsupported NPM_WRAPPER_TOOL '$tool', expected npm or npx."
  exit 1
fi

npm_command=("$tool")
if [ -z "$DRUPAL_ENV_LOCAL" ] && [ -z "$DRUPAL_ENV_REMOTE" ] && [ "$NPM_RUN_IN" != "local" ]; then
  npm_command=(ddev "$tool")
fi

# Support MacOS and Linux.
md5_for()
{
  if builtin command -v md5 > /dev/null; then
    echo "$1" | md5
  else
    echo "$1" | md5sum | awk '{print $1}'
  fi
}

lock_before=$(md5_for "$(cat package-lock.json 2>/dev/null)")

EXIT_STATUS=0

set -x
"${npm_command[@]}" "$@" || EXIT_STATUS=$?
{ set +x; } 2>/dev/null

# Like composer.sh, record commands that change package-lock.json in npm.log.
# Unlike composer.sh, only the command that actually changed the file is
# logged, so a lockfile edited by other means is never attributed to whatever
# command happens to run next. The hash is of the lockfile diff against git.
if [ "$(git rev-parse --is-inside-work-tree 2>/dev/null)" = "true" ]; then
  if [[ "$lock_before" != "$(md5_for "$(cat package-lock.json 2>/dev/null)")" ]]; then
    hash=$(md5_for "$(git diff package-lock.json)")
    branch=$(git rev-parse --abbrev-ref HEAD)
    if [[ "$branch" = 'HEAD' ]]; then
      for location in rebase-merge rebase-apply; do
        path=$(git rev-parse --git-path ${location})
        if test -d "${path}"; then
          revision=$(<"${path}/head-name")
          branch=${revision##refs/heads/}
        fi
      done
    fi
    echo -e "$hash|$(git config user.name)|$branch|$(date)|./$tool.sh $*" >> npm.log
    echo "package-lock.json changed, recorded './$tool.sh $*' in npm.log."
  fi
fi

exit "${EXIT_STATUS}"
