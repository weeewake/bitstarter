#!/usr/bin/env node

// use the node interpreter to run this script. note that we are using env because the shabang directive needs an absolute path


// Note: declare one variable per line. Use the var keyword once per line.
var fs = require('fs');

// commander.js : CLI's for node made easy
var program = require('commander');

// cheerio.js 	: jQuery for node
var cheerio = require('cheerio');

// restler.js REST Library for node
var rest = require('restler');

// Use capitals to declare constants
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

// use variables to hold functions
var assertFileExists = function(infile) {
	var instr = infile.toString();
	if(!fs.existsSync(instr)) {
		console.log("%s does not exist. Exiting.", instr);
		// exit with 0 for success, 1 for failure
		process.exit(1);
	}
	// note that the function returns the argument to allow chaining of functions
	return instr;
};

var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(fs.readFileSync(htmlfile));
}

var cheerioString = function(str) {
	return cheerio.load(str);
}

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
}

var checkString = function(str, checksfile) {
	$ = cheerioString(str);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	}
	return out;	
}

var checkHtmlFile = function(htmlfile, checksfile) {
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	}
	return out;	
}

var clone = function(fn) {
	return fn.bind({});
}

if(require.main == module) {
	program
		.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
		.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url <url>', 'Path to URL' )
		.parse(process.argv);

	if(program.url) {
		rest.get(program.url)
			.on('complete', function (result) {
				var checkJson = checkString( result, program.checks );
				var outJson = JSON.stringify(checkJson, null, 4);
				console.log(outJson);
				process.exit(0);
			});
	} else {
		var checkJson = checkHtmlFile(program.file, program.checks);
		var outJson = JSON.stringify(checkJson, null, 4);
		console.log(outJson);
	}

} else {
	exports.checkHtmlFile = checkHtmlFile;
}