require('./global');
require('./loader');

var Configuration = s3uploader.require('S3Uploader_Configuration');
var EventService = s3uploader.require('S3Uploader_EventService');
var Application = s3uploader.require('S3Uploader_Application');

var config  = new Configuration();
var emitter = new EventService();
var application = new Application(emitter, config);

application.start();
