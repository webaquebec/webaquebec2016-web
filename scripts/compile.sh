#!/bin/sh
node ./node_modules/gulp/bin/gulp pull_dependencies && \
#node ./node_modules/gulp/bin/gulp lint && \
node ./node_modules/gulp/bin/gulp compile && \
#node ./node_modules/gulp/bin/gulp test && \
node ./node_modules/requirejs/bin/r -o www/build.js
#cordova build $1