process.chdir(__dirname);
require('./global');

var config = require('./config').instance;
var ClassLoader = require('./src/ClassLoader');

var classLoader = new ClassLoader(config.classLoader);
global.s3uploader.require = classLoader.require;

var EventService = s3uploader.require('S3Uploader_EventService');
var Application = s3uploader.require('S3Uploader_Application');

var emitter = new EventService();
var application = new Application(emitter, config);
application.start();
