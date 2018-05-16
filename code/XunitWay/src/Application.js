var EventType = require(s3uploader.ROOTDIR + 'src/EventType');
var FileWatcher = require(s3uploader.ROOTDIR + 'src/FileWatcher');
var LimitedQueue = require(s3uploader.ROOTDIR + 'src/LimitedQueue');
var S3Sender = require(s3uploader.ROOTDIR + 'src/S3Sender');
var Logger = require(s3uploader.ROOTDIR + 'src/Logger');

module.exports = S3Uploader_XunitWay_Application;

/**
 * @param {S3Uploader_XunitWay_EventService} emitter
 * @param {S3Uploader_XunitWay_Configuration} config
 * @param {Object} deps -- deps for a unit testing
 */
function S3Uploader_XunitWay_Application(emitter, config, deps = {}) {

  var self = this;

  /** @type {S3Uploader_FastWay_FileWatcher} */
  self._fileWatcher = deps._fileWatcher || new FileWatcher(emitter, config.chokidar);

  /** @type {S3Uploader_FastWay_LimitedQueue} */
  self._limitedQueue = deps._limitedQueue || new LimitedQueue(emitter, config.tasks_queue);

  /** @type {S3Uploader_FastWay_S3Sender} */
  self._s3Sender = deps._s3Sender || new S3Sender(emitter, config.knox);

  /** @type {S3Uploader_FastWay_Logger} */
  self._logger = deps._logger || new Logger();

  emitter.on(EventType.SERVICE_START, self._fileWatcher.startWatching);
  emitter.on(EventType.EMERGED_FILE, self._limitedQueue.addFileToQueue);
  emitter.on(EventType.MOVE_NEEDED, self._s3Sender.moveToStore);
  emitter.on(EventType.MOVE_SUCCEED, self._limitedQueue.speedUpProcessing);
  emitter.on(EventType.MOVE_FAILING, self._limitedQueue.slowDownProcessing);
  emitter.on(EventType.SERVICE_STOP, self._fileWatcher.stopWatching);
  emitter.on(EventType.SERVICE_START, self._logger.logStart);
  emitter.on(EventType.SERVICE_STOP, self._logger.logStop);
  emitter.on(EventType.MOVE_SUCCEED, self._logger.logSuccess);
  emitter.on(EventType.MOVE_FAILING, self._logger.logError);

  self.start = function start() {
    emitter.emitServiceStartEvent();
  };
}
