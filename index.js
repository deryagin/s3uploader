var FileWatcher = require('./src/FileWatcher');
var LimitedQueue = require('./src/LimitedQueue');
var S3Client = require('./src/S3Client');
var EventService = require('./src/EventService');
var config = require('./config');

var eventService = new EventService();
var fileWatcher = new FileWatcher(config, eventService);
var limitedQueue = new LimitedQueue(config, eventService);
var s3Client = new S3Client(config, eventService);
eventService.start();
