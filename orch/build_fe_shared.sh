#!/usr/bin/env bash

set -e

./orch/show_file.sh $0

green='\033[0;32m'
NC='\033[0m'
echo "Front end can be built by using the file ./orch/build_fe_shared.sh, it is Node 18"

echo "Updating storybook components in theme"
source_dir="./stories"
icons_source_dir="./stories/assets/icons"
icons_target_dir="./web/icons"
components_target_dir="./web/themes/custom/bixal_uswds/storybook_components"
sass_target_dir="./web/themes/custom/bixal_uswds/src/sass/storybook-sass"
js_target_dir="./web/themes/custom/bixal_uswds/src/js/storybook-js"

if [ -d $source_dir ]
then

    if [ -d $components_target_dir ]
    then
        echo -e "${green}Removing theme components folder${NC}"
        rm -R $components_target_dir
    else
        echo ""
    fi
    if [ -d $icons_target_dir ]
    then
        echo -e "${green}Removing theme icons folder${NC}"
        rm -R $icons_target_dir
    else
        echo ""
    fi
    if [ -d $sass_target_dir ]
    then
        echo -e "${green}Removing theme sass folder${NC}"
        rm -R $sass_target_dir
    else
        echo ""
    fi
    if [ -d $js_target_dir ]
    then
        echo -e "${green}Removing theme js folder${NC}"
        rm -R $js_target_dir
    else
        echo ""
    fi

    echo -e "${green}Copying theme components folders${NC}"
    mkdir $components_target_dir $js_target_dir 
    # Copy all content for the components leaving directory structure, the files
    # not needed will be removed later.
    cp -r "$source_dir" "$components_target_dir"
    # Copy all icons to new directory in web
    cp -r "$icons_source_dir" "$icons_target_dir"
    # Copy all the custom sass files files and preserve directory structure.
    cp -r "$source_dir" "$sass_target_dir"
    # Remove all non-twig files from the components.
    find "$components_target_dir" -type f \( -name "*.scss" -o -name "*.js" -o -name "*.json" \) -exec rm -f {} \;
    # Remove all non-css files from the sass dir.
    find "$sass_target_dir" -type f ! -name "*.scss" -delete
    # Remove any empty directories now that non-scss have been deleted
    find "$sass_target_dir" -type d -empty -delete
    # Copy all JS files and put them in a single dir.
    find "$source_dir" -name '*.js' -exec cp {} "$js_target_dir" \;
    # Remove the storybook JS files, they do nothing for Drupal.
    find "$js_target_dir" -name '*.stories.js' -delete
else
    echo "The storybook components directory, $source_dir, did not exist."
    exit 1
fi


# Run in sub-shell so CWD is preserved.
(
  cd web/themes/custom/bixal_uswds

  if [ -d "node_modules" ]
  then
      echo "Directory node_modules exists."
      echo -e "${green}Removing node_modules folder${NC}"
      rm -R node_modules
  else
      echo ""
  fi

  echo -e "${green}Installing NPMs${NC}"
  npm install

  echo -e "${yellow}Gulp Build${NC}"
  gulp
)
./orch/show_file.sh $0 end
