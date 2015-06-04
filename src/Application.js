var EventType = require(s3uploader.ROOT_DIR + 'EventType');
var FileWatcher = require(s3uploader.ROOT_DIR + 'FileWatcher');
var LimitedQueue = require(s3uploader.ROOT_DIR + 'LimitedQueue');
var S3Sender = require(s3uploader.ROOT_DIR + 'S3Sender');
var Logger = require(s3uploader.ROOT_DIR + 'Logger');

module.exports = S3Uploader_Application;

/**
 * @param {S3Uploader_Config} config
 * @param {S3Uploader_EventService} emitter
 */
function S3Uploader_Application(config, emitter) {

  var self = this;

  /** @type {S3Uploader_FileWatcher} */
  var _fileWatcher = new FileWatcher(config.chokidar, emitter);

  /** @type {S3Uploader_LimitedQueue} */
  var _limitedQueue = new LimitedQueue(config.tasks_queue, emitter);

  /** @type {S3Uploader_S3Courier} */
  var _s3Sender = new S3Sender(config.knox, emitter);

  /** @type {S3Uploader_Logger} */
  var _logger = new Logger();

  (function _eventness() {
    emitter.on(EventType.SERVICE_START, _fileWatcher.startWatching);
    emitter.on(EventType.EMERGED_FILE, _limitedQueue.addFileToQueue);
    emitter.on(EventType.PROCESS_FILE, _s3Sender.moveToStore);
    emitter.on(EventType.MOVE_SUCCEED, _limitedQueue.continueProcessing);
    emitter.on(EventType.MOVE_FAILING, _limitedQueue.slowDownProcessing);
    emitter.on(EventType.SERVICE_STOP, _fileWatcher.stopWatching);
    addLoggerListener();
  })();

  self.start = function () {
    emitter.emitServiceStartEvent();
  };

  // вызуально отделяем логирование от основного блока обработчиков событий
  function addLoggerListener() {
    emitter.on(EventType.MOVE_SUCCEED, _logger.logSuccess);
    emitter.on(EventType.MOVE_FAILING, _logger.logError);
  }
}
