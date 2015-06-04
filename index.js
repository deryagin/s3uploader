process.chdir(__dirname);

require('./global');
var config = s3uploader.include('S3Uploader_Config').instance;
var EventService = s3uploader.include('S3Uploader_EventService');
var Application = s3uploader.include('S3Uploader_Application');

//var config = require(s3uploader.ROOT_DIR + 'config');
//var EventService = require(s3uploader.ROOT_DIR + 'src/EventService');
//var Application = require(s3uploader.ROOT_DIR + 'src/Application');

var emitter = new EventService();
var application = new Application(config, emitter);
application.start();
