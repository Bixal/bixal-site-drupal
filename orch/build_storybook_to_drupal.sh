#!/usr/bin/env bash

set -e

./orch/show_file.sh $0

green='\033[0;32m'
NC='\033[0m'
echo "Copy files from storybook to Drupal before node build, see ./orch/build_storybook_to_drupal.sh"

echo "Updating storybook components in theme"
source_dir="./stories"
icons_source_dir="./stories/assets/icons"
icons_target_dir="./web/icons"
legacy_static_images_src_dir="./stories/assets/static"
legacy_static_images_target_dir="./web/static"
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
    if [ -d $legacy_static_images_target_dir ]
    then
      echo -e "${green}Removing legacy images folder${NC}"
      rm -R $legacy_static_images_target_dir
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
    # Copy all static images to new direcctory in web
    cp -r "$legacy_static_images_src_dir" "$legacy_static_images_target_dir"
    # Copy all the custom sass files files and preserve directory structure.
    cp -r "$source_dir" "$sass_target_dir"
    # Remove all non-twig files from the components.
    find "$components_target_dir" -type f \( -name "*.scss" -o -name "*.js" -o -name "*.json" \) -exec rm -f {} \;
    # Remove all non-css files from the sass dir.
    find "$sass_target_dir" -type f ! -name "*.scss" -delete
    # Remove any empty directories now that non-scss have been deleted
    find "$sass_target_dir" -type d -empty -delete
    # Copy all JS files and put them in a single dir.
    cp -r "$source_dir" "$js_target_dir"
    # Remove the storybook JS files, they do nothing for Drupal.
    find "$js_target_dir" -name '*.stories.js' -delete;
    find "$js_target_dir" -type f \( -name "*.scss" -o -name "*.twig" -o -name "*.json" \) -exec rm -f {} \;
    find "$js_target_dir" -type d -empty -delete
else
    echo "The storybook components directory, $source_dir, did not exist."
    exit 1
fi

./orch/show_file.sh $0 end
