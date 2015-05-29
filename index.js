/**
 * Вынести логику этого файла в Application.js.
 * Инициализацию переменных поместить в (function _initialize() {})();
 * Настройку событий поместить в (function _eventness() {})();
 */
var EventType = require('./src/EventType');
var FileWatcher = require('./src/FileWatcher');
var LimitedQueue = require('./src/LimitedQueue');
var S3Client = require('./src/S3Client');
var EventService = require('./src/EventService');
var config = require('./config');

var eventService = new EventService();
var fileWatcher = new FileWatcher(config, eventService);
var limitedQueue = new LimitedQueue(config, eventService);
var s3Client = new S3Client(config, eventService);

eventService.on(EventType.SERVICE_START, fileWatcher.startWatching);
eventService.on(EventType.EMERGED_FILE, limitedQueue.addFileToQueue);
eventService.on(EventType.PROCESS_FILE, s3Client.sendToStore);
eventService.on(EventType.MOVE_SUCCEED, limitedQueue.continueProcessing);
eventService.on(EventType.MOVE_FAILING, limitedQueue.slowDownProcessing);
eventService.on(EventType.SERVICE_STOP, fileWatcher.stopWatching);
eventService.start();
