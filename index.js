process.chdir(__dirname);

require('./global');
var ClassLoader = require('./src/ClassLoader');

var classLoader = new ClassLoader();
classLoader.addNamespace('S3Uploader', s3uploader.ROOT_DIR + 'src/'); // todo: вынести в конфиг, возможно
s3uploader.require = loader.require;

var config = s3uploader.require('S3Uploader_Config').instance;
var EventService = s3uploader.require('S3Uploader_EventService');
var Application = s3uploader.require('S3Uploader_Application');

//var config = require(s3uploader.ROOT_DIR + 'config');
//var EventService = require(s3uploader.ROOT_DIR + 'src/EventService');
//var Application = require(s3uploader.ROOT_DIR + 'src/Application');

var emitter = new EventService();
var application = new Application(config, emitter);
application.start();
