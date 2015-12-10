var EventType = require(s3uploader.ROOTDIR + 'src/EventType');
var FileWatcher = require(s3uploader.ROOTDIR + 'src/FileWatcher');
var LimitedQueue = require(s3uploader.ROOTDIR + 'src/LimitedQueue');
var S3Sender = require(s3uploader.ROOTDIR + 'src/S3Sender');
var Logger = require(s3uploader.ROOTDIR + 'src/Logger');

module.exports = S3Uploader_XunitWay_Application;

/**
 * @param {S3Uploader_XunitWay_EventService} emitter
 * @param {S3Uploader_XunitWay_Configuration} config
 */
function S3Uploader_XunitWay_Application(emitter, config) {

  var self = this;

  /** @type {S3Uploader_XunitWay_EventService} */
  self._emitter = emitter;

  /** @type {S3Uploader_XunitWay_Configuration} */
  self._config = config;

  /** @type {S3Uploader_XunitWay_FileWatcher} */
  self._fileWatcher = null;

  /** @type {S3Uploader_XunitWay_LimitedQueue} */
  self._limitedQueue = null;

  /** @type {S3Uploader_XunitWay_S3Sender} */
  self._s3Sender = null;

  /** @type {S3Uploader_XunitWay_Logger} */
  self._logger = null;

  self._populate = function _populate() {
    self._fileWatcher = new FileWatcher(self._emitter, self._config.chokidar);
    self._limitedQueue = new LimitedQueue(self._emitter, self._config.tasks_queue);
    self._s3Sender = new S3Sender(self._emitter, self._config.knox);
    self._logger = new Logger();
  };

  self._eventness = function _eventness() {
    emitter.on(EventType.SERVICE_START, self._fileWatcher.startWatching);
    emitter.on(EventType.EMERGED_FILE, self._limitedQueue.addFileToQueue);
    emitter.on(EventType.MOVE_NEEDED, self._s3Sender.moveToStore);
    emitter.on(EventType.MOVE_SUCCEED, self._limitedQueue.speedUpProcessing);
    emitter.on(EventType.MOVE_FAILING, self._limitedQueue.slowDownProcessing);
    emitter.on(EventType.SERVICE_STOP, self._fileWatcher.stopWatching);
  };

  self._logging = function _logging() {
    emitter.on(EventType.SERVICE_START, self._logger.logStart);
    emitter.on(EventType.SERVICE_STOP, self._logger.logStop);
    emitter.on(EventType.MOVE_SUCCEED, self._logger.logSuccess);
    emitter.on(EventType.MOVE_FAILING, self._logger.logError);
  };

  (S3Uploader_XunitWay_Application._initialize || function _initialize() {
    self._populate();
    self._eventness();
    self._logging();
  })();

  self.start = function start() {
    emitter.emitServiceStartEvent();
  };
}
