#!/usr/bin/env bash

./orch/build_storybook_to_drupal.sh

./orch/show_file.sh $0

green='\033[0;32m'
yellow='\033[0;33m'
red='\033[0;31m'
NC='\033[0m'
echo "Front end can be built by using the file ./orch/build_node.sh"

# find all custom themes that contain a package.json file
directories=$(find */themes/custom -maxdepth 2 -type f -name 'package.json' -exec dirname {} \; 2>/dev/null)

# Directories command may error if the dir does not exist, so don't set -e yet.
set -e

# Themes are npm workspaces of the project root, so every theme's dependencies
# are installed once, here, against the root lockfile. Running `npm install`
# inside a theme instead would ignore that lockfile and build a private
# node_modules that shadows the hoisted packages with stale versions.
echo -e "${green}Installing NPMs (workspace root)${NC}"
npm install --prefer-offline

# Loop through each directory found
for dir in $directories; do
    echo "Processing directory: $dir"
    # Run in sub-shell so CWD is preserved.
    (
      cd $dir

      # Look for a gulpfile (could be .js, .ts, etc.)
      if compgen -G "gulpfile.*" > /dev/null; then
        echo -e "${yellow}Gulp build detected in $dir${NC}"

        # gulp is hoisted to the workspace root, so there is no local
        # node_modules/.bin/gulp to test for. Ask the resolver instead, which
        # walks up the tree the same way require() does.
        if npx --no-install gulp --version > /dev/null 2>&1; then
          echo "Running gulp..."
          npx gulp compile
        else
          echo -e "${red}Gulp is not resolvable from $dir. Please run:${NC}"
          echo "  npm install"
          echo "  ...from the project root, where the workspaces are declared."
          exit 1
        fi
      fi
    )
done

./orch/show_file.sh $0 end
