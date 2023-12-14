#!/usr/bin/env bash

# Exit the hook on any failure
set -e

green='\033[0;32m'
NC='\033[0m'
echo "Front end can be built by using the file ./orch/build_fe_shared.sh, it is Node 18"

echo "Updating storybook components in theme"
source_dir="./stories"
components_target_dir="./web/themes/custom/bixal_uswds/storybook_components"
sass_target_dir="./web/themes/custom/bixal_uswds/src/sass/storybook_sass"
js_target_dir="./web/themes/custom/bixal_uswds/src/js/storybook_js"

if [ -d $source_dir ]
then

    if [ -d $components_target_dir ]
    then
        echo -e "${green}Removing theme components folder${NC}"
        rm -R $components_target_dir
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
    mkdir $components_target_dir $sass_target_dir $js_target_dir
    cp -r "$source_dir" "$components_target_dir"
    find "$components_target_dir" -type f \( -name "*.scss" -o -name "*.js" -o -name "*.json" \) -exec rm -f {} \;
    find "$js_target_dir" -name '*.stories.js' -delete
else
    echo "The storybook components directory, $source_dir, did not exist."
    exit 1
fi

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
