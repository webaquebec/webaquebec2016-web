#!/bin/sh

npm install
node ./node_modules/gulp/bin/gulp test && \
node ./node_modules/mocha/bin/mocha
