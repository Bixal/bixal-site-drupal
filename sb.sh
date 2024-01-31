#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

npm install
npm run build-storybook
npm run storybook:local
