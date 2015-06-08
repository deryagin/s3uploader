var EventType = s3uploader.require('S3Uploader_EventType');
var FileWatcher = s3uploader.require('S3Uploader_FileWatcher');
var LimitedQueue = s3uploader.require('S3Uploader_LimitedQueue');
var S3Sender = s3uploader.require('S3Uploader_S3Sender');
var Logger = s3uploader.require('S3Uploader_Logger');

module.exports = S3Uploader_Application;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Config} config
 */
function S3Uploader_Application(emitter, config) {

  var self = this;

  /** @type {S3Uploader_FileWatcher} */
  var _fileWatcher = new FileWatcher(emitter, config.chokidar);

  /** @type {S3Uploader_LimitedQueue} */
  var _limitedQueue = new LimitedQueue(emitter, config.tasks_queue);

  /** @type {S3Uploader_S3Sender} */
  var _s3Sender = new S3Sender(emitter, config.knox);

  /** @type {S3Uploader_Logger} */
  var _logger = new Logger();

  (function _eventness() {
    emitter.on(EventType.SERVICE_START, _fileWatcher.startWatching);
    emitter.on(EventType.EMERGED_FILE, _limitedQueue.addFileToQueue);
    emitter.on(EventType.MOVE_NEEDED, _s3Sender.moveToStore);
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
