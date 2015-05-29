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

/**
 * @todo: имена событий не должны быть привязаны к реализации.
 * Так событие EventType.FSWATCER_FILE_ADDED отражает тот факт,
 * что файл был добавлен в ФС. Хотя файл может появляться не в ФС,
 * а напр. в БД или на FTP итп.
 */
eventService.on(EventType.EVENT_SERVICE_START, fileWatcher.startWatching);
eventService.on(EventType.FSWATCER_FILE_ADDED, limitedQueue.addFileToQueue);
eventService.on(EventType.QUEUE_FILE_ADDED, s3Client.sendToStore);
eventService.on(EventType.S3CLIENT_FILE_SAVED, limitedQueue.continueProcessing);
eventService.on(EventType.S3CLIENT_FILE_FAIL, limitedQueue.slowDownProcessing);
eventService.on(EventType.EVENT_SERVICE_STOP, fileWatcher.stopWatching);
eventService.start();
