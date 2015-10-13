Cortex Web Engine
========================

We're trying to make something decent.


1. Folders definitions
	- Compiled files and folders are in www/*
	- Assets should be placed in assets/* (Either JSON, Img, Templates)
	- Typescript Source code is in src/com/cortex
	- Commons modules are in /src/com/cortex/utils
	- TypeScript definitions are in ./definitions
	- Compilation tasks are defined in gulpfile.js
	- We use require.js to include external libraries. File is currently in www/bootstrap.js (TODO: Most to parent and add to compilation)

2. Often run gulp tasks.
	- gulp pull_dependencies <-- Copies bower_components and specific files to www/lib.
	- gulp clean <-- Cleans all the assets and lib in www/*
	- gulp compile <-- Run the whole compilation task
	- gulp watch <-- Run a http server and watch for changes in source code...

3. Instructions to use as a external repos
	- Add the branch to your git project
		git remote add cortexwebengine http://...git_clone_url_for_cortexwebengine
	- Fetch some changes
		git fetch cortexwebengine
	- Rebase the changes with your project
		git rebase cortexwebengine/master

