var EventType = require(s3uploader.ROOT_DIR + 'EventType');
var FileWatcher = require(s3uploader.ROOT_DIR + 'FileWatcher');
var LimitedQueue = require(s3uploader.ROOT_DIR + 'LimitedQueue');
var S3Courier = require(s3uploader.ROOT_DIR + 'S3Courier');
var S3UploaderLogger = require(s3uploader.ROOT_DIR + 'S3UploaderLogger');

module.exports = Application;

/**
 * @param {Object} config
 * @param {EventService} emitter
 */
function Application(config, emitter) {

  var self = this;

  var _fileWatcher = new FileWatcher(config.chokidar, emitter);

  var _limitedQueue = new LimitedQueue(config.tasks_queue, emitter);

  var _s3Courier = new S3Courier(config.knox, emitter);

  var _logger = new S3UploaderLogger();

  (function _eventness() {
    emitter.on(EventType.SERVICE_START, _fileWatcher.startWatching);
    emitter.on(EventType.EMERGED_FILE, _limitedQueue.addFileToQueue);
    emitter.on(EventType.PROCESS_FILE, _s3Courier.moveToStore);
    emitter.on(EventType.MOVE_SUCCEED, _limitedQueue.continueProcessing);
    emitter.on(EventType.MOVE_FAILING, _limitedQueue.slowDownProcessing);
    emitter.on(EventType.SERVICE_STOP, _fileWatcher.stopWatching);

    // вызуально отделяем логирование от основного потока событий
    emitter.on(EventType.MOVE_SUCCEED, _logger.logSuccess);
    emitter.on(EventType.MOVE_FAILING, _logger.logError);
  })();

  self.start = function () {
    emitter.emitServiceStartEvent();
  };
}
