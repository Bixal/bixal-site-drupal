#!/usr/bin/env bash

./orch/build_storybook_to_drupal.sh

./orch/show_file.sh $0

green='\033[0;32m'
NC='\033[0m'
echo "Front end can be built by using the file ./orch/build_node.sh"

# find all custom themes that contain a package.json file
directories=$(find */themes/custom -maxdepth 2 -type f -name 'package.json' -exec dirname {} \; 2>/dev/null)

# Directories command may error if the dir does not exist, so don't set -e yet.
set -e

# Loop through each directory found
for dir in $directories; do
    echo "Processing directory: $dir"
    # Run in sub-shell so CWD is preserved.
    (
      cd $dir

      echo -e "${green}Installing NPMs${NC}"
      npm install --prefer-offline

      # Look for a gulpfile (could be .js, .ts, etc.)
      if compgen -G "gulpfile.*" > /dev/null; then
        echo -e "${yellow}Gulp build detected in $dir${NC}"

        if [[ -x "node_modules/.bin/gulp" ]]; then
          echo "Running local gulp..."
          npx gulp
        else
          echo -e "${red}Gulp is not installed locally in $dir. Please run:${NC}"
          echo "  npm install --save-dev gulp"
          exit 1
        fi
      fi
    )
done

./orch/show_file.sh $0 end
