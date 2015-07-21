var EventType = s3uploader.require('S3Uploader_EventType');
var FileWatcher = s3uploader.require('S3Uploader_FileWatcher');
var LimitedQueue = s3uploader.require('S3Uploader_LimitedQueue');
var S3Sender = s3uploader.require('S3Uploader_S3Sender');
var Logger = s3uploader.require('S3Uploader_Logger');

module.exports = S3Uploader_Application;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Configuration} config
 */
function S3Uploader_Application(emitter, config) {

  var self = this;

  /** @type {S3Uploader_FileWatcher} */
  self._fileWatcher = new FileWatcher(emitter, config.chokidar);

  /** @type {S3Uploader_LimitedQueue} */
  self._limitedQueue = new LimitedQueue(emitter, config.tasks_queue);

  /** @type {S3Uploader_S3Sender} */
  self._s3Sender = new S3Sender(emitter, config.knox);

  /** @type {S3Uploader_Logger} */
  self._logger = new Logger();

  (function _eventness() {
    emitter.on(EventType.SERVICE_START, self._fileWatcher.startWatching);
    emitter.on(EventType.EMERGED_FILE, self._limitedQueue.addFileToQueue);
    emitter.on(EventType.MOVE_NEEDED, self._s3Sender.moveToStore);
    emitter.on(EventType.MOVE_SUCCEED, self._limitedQueue.speedUpProcessing);
    emitter.on(EventType.MOVE_FAILING, self._limitedQueue.slowDownProcessing);
    emitter.on(EventType.SERVICE_STOP, self._fileWatcher.stopWatching);

    emitter.on(EventType.MOVE_SUCCEED, self._logger.logSuccess);
    emitter.on(EventType.MOVE_FAILING, self._logger.logError);
  })();

  self.start = function start() {
    emitter.emitServiceStartEvent();
  };
}
