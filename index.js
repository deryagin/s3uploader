var FileWatcher = require('./src/FileWatcher');
var LimitedQueue = require('./src/LimitedQueue');
var S3Client = require('./src/S3Client');
var EventService = require('./src/EventService');
var config = require('./config');

var eventService = new EventService();
var fileWatcher = new FileWatcher(config, eventService);
var limitedQueue = new LimitedQueue(config, eventService);
var s3Client = new S3Client(config, eventService);

eventService.on(EventType.EVENT_SERVICE_START, fileWatcher.onEmitterStart);
eventService.on(EventType.FSWATCER_FILE_ADDED, limitedQueue.onFsFileAdded);
eventService.on(EventType.QUEUE_FILE_ADDED, s3Client.onQueueFileAdded);
eventService.on(EventType.S3CLIENT_FILE_SAVED, limitedQueue.onS3FileSaved);
eventService.on(EventType.EVENT_SERVICE_STOP, fileWatcher.onEmitterStop);
eventService.start();
