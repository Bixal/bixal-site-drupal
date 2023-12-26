#!/usr/bin/env bash

# Exit the hook on any failure
set -e

green='\033[0;32m'
NC='\033[0m'

# @TODO: Do what it takes to build the front end.
exit 0

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
