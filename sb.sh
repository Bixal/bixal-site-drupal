#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

npm install
npm run build-storybook
NODE_OPTIONS="--max-old-space-size=8192" npm run storybook:local
