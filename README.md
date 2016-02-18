Quebec Site Numerique Website Waq 2016
========================

Website of WAQ.

# Prerequisite

- NPM is installed
- sass is installed
- Modules are installed using ``npm install``
- You have the following tools installed globally:
- ``npm install -g typescript``
- ``npm install -g gulp``
- ``npm install -g webpack``
- ``npm install -g selenium-webdriver``
- ``npm install -g chromedriver``

# Available tasks

Tasks are stored as NPM Scripts.

They should be used over installing software with npm install -g.

It avoids getting conflicts with stations that have a lot of npm packages installed

You can run them with npm run A_SCRIPT_NAME.

Here's a few commands more can be found in the package.json.

```bash

# Compile assets
npm run assets

# Compile typescript
npm run compile

# Go in watch mode
npm run watch

```

# Folders definitions
	- Compiled files and folders are in www/*
	- Assets should be placed in assets/* (Either JSON, Img, Templates)
	- Typescript Source code is in src/com/cortex
	- Commons modules are in /src/com/cortex/utils
	- TypeScript definitions are in ./definitions
	- Compilation tasks are defined in gulpfile.js
	- We use require.js to include external libraries. File is currently in www/bootstrap.js (TODO: Most to parent and add to compilation)

# Instructions to use as a external repos
	- Add the branch to your git project
		git remote add cortexwebengine http://...git_clone_url_for_cortexwebengine
	- Fetch some changes
		git fetch cortexwebengine
	- Rebase the changes with your project
		git rebase cortexwebengine/master
