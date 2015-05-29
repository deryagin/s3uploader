var FsWatcher = require('./src/FsWatcher');
var LimitedQueue = require('./src/LimitedQueue');
var S3Client = require('./src/S3Client');
var EventEmitter = require('events').EventEmitter;

var config = require('./config');
var emitter = new EventEmitter();

var fsWatcher = new FsWatcher(config, emitter);
var limitedQueue = new LimitedQueue(config, emitter);
var s3Client = new S3Client(config, emitter);
