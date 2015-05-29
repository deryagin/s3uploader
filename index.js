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
 * @todo: S3Client пофиг откуда взялся файл.
 * Поэтому нужно переименовать метод s3Client.onQueueFileAdded во
 * что-то типа s3Client.moveToStore. Тоже относится и к именам других
 * методов. Имена должны отражать не то, что метод стабатывает при
 * возникновении определенногоо события, а то, что этот метод выполняет.
 * Тем более, что какой-то метод может вызываться для нескольких событий.
 */
eventService.on(EventType.EVENT_SERVICE_START, fileWatcher.onEmitterStart);
eventService.on(EventType.FSWATCER_FILE_ADDED, limitedQueue.onFsFileAdded);
eventService.on(EventType.QUEUE_FILE_ADDED, s3Client.onQueueFileAdded);
eventService.on(EventType.S3CLIENT_FILE_SAVED, limitedQueue.onS3FileSaved);
eventService.on(EventType.EVENT_SERVICE_STOP, fileWatcher.onEmitterStop);
eventService.start();
