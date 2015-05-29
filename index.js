var FsWatcher = require('./src/FsWatcher');
var LimitedQueue = require('./src/LimitedQueue');
var S3Client = require('./src/S3Client');
var EventService = require('./src/EventService');
var config = require('./config');

var emitter = new EventService();
var fsWatcher = new FsWatcher(config, emitter);
var limitedQueue = new LimitedQueue(config, emitter);
var s3Client = new S3Client(config, emitter);
emitter.start();
