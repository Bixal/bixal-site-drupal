#!/usr/bin/env bash

set -e

./orch/show_file.sh $0

green='\033[0;32m'
NC='\033[0m'
echo "Copy runtime assets from storybook to Drupal before node build, see ./orch/build_storybook_to_drupal.sh"

echo "Updating storybook templates and images in theme"
# Only runtime assets are copied. Drupal reads the Twig templates off disk
# and the webserver serves the images, so both have to live in the build
# artifact (which drops node_modules). Sass and JS are build inputs, and the
# theme's gulp build resolves those straight out of the
# @bixal/design-system workspace package instead.
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
    fi
    if [ -d $icons_target_dir ]
    then
        echo -e "${green}Removing theme icons folder${NC}"
        rm -R $icons_target_dir
    fi
    # No longer generated, but a stale copy from an older checkout would still
    # be picked up by the theme's Sass includes and JS glob, so clear it out.
    if [ -d $sass_target_dir ]
    then
        echo -e "${green}Removing stale theme sass folder${NC}"
        rm -R $sass_target_dir
    fi
    if [ -d $js_target_dir ]
    then
        echo -e "${green}Removing stale theme js folder${NC}"
        rm -R $js_target_dir
    fi
    if [ -d $legacy_static_images_target_dir ]
    then
      echo -e "${green}Removing legacy images folder${NC}"
      rm -R $legacy_static_images_target_dir
    fi

    echo -e "${green}Copying theme components folders${NC}"
    mkdir $components_target_dir
    # Copy all content for the components leaving directory structure, the files
    # not needed will be removed later.
    cp -r "$source_dir" "$components_target_dir"
    # Copy all icons to new directory in web
    cp -r "$icons_source_dir" "$icons_target_dir"
    # Copy all static images to new direcctory in web
    cp -r "$legacy_static_images_src_dir" "$legacy_static_images_target_dir"
    # Remove all non-twig files from the components.
    find "$components_target_dir" -type f \( -name "*.scss" -o -name "*.js" -o -name "*.json" \) -exec rm -f {} \;
else
    echo "The storybook components directory, $source_dir, did not exist."
    exit 1
fi

./orch/show_file.sh $0 end
