var namespaceMap = require('./package.json').s3uploader.autoload;
var Autoloader = require('./src/Autoloader');

var autoloader = new Autoloader(s3uploader.ROOTDIR, namespaceMap);
global.s3uploader.require = autoloader.require;
