#!/usr/bin/env bash

cd "$(dirname "$0")" || exit


if [ ! -d bixal-pa11y-node ]; then
  git clone git@bitbucket.org:bixal/bixal-pa11y-node.git
  cd bixal-pa11y-node
  npm install
else
  cd bixal-pa11y-node
fi

node app.js -c config.json -s http://bixalcom.lndo.site/sitemap.xml?page=1

echo 'HTML reports can be found in bixal-pa11y-node/pa11y_html'
