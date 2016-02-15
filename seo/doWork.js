/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author    Mathieu Rhéaume
 */

// This script crawls the list of pages passed in parameter.
var webdriver = require('selenium-webdriver');
var fs = require('fs');
var pathOutput = "./output/";

function runTest(pathName, filename) {

    var driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.chrome()).
        build();

    driver.get(pathName);

    driver
	.wait(function() {
    	return driver.isElementPresent(webdriver.By.className('seo'));
	},
	30000,
	'Yolo couldnt load')
	.then(function() {
    	driver.getPageSource().then(function(source) {
            // Save to HDA
            var strOut = pathName.split("#")[1];
            fs.writeFileSync(pathOutput + filename, source);
            driver.quit();
    	});
	});
}

console.log('running crawling for ' + process.argv[2]);
runTest(process.argv[2], process.argv[3]);
