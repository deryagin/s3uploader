var FSWatcher = require('chokidar').FSWatcher;

module.exports = S3Uploader_FileWatcher;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Configuration.chokidar} config
 */
function S3Uploader_FileWatcher(emitter, config) {

  var self = this;

  /** @type {S3Uploader_EventService} */
  self._emitter = emitter;

  /** @type {S3Uploader_Configuration} */
  self._config = config;

  /** @type {FSWatcher} */
  self._fsWatcher = null;

  self._populate = function _populate() {
    self._fsWatcher = new FSWatcher(config.options);
  };

  (S3Uploader_FileWatcher._initialize || function _initialize() {
    self._populate();
  })();

  /**
   * @see {S3Uploader_EventService.emitServiceStartEvent}
   * @listens {S3Uploader_EventType.SERVICE_START}
   */
  self.startWatching = function startWatching() {
    self._fsWatcher.add(config.path);
    self._fsWatcher.on('add', emitter.emitEmergedFileEvent);
  };

  /**
   * @see {S3Uploader_EventService.emitServiceStopEvent}
   * @listens {S3Uploader_EventType.SERVICE_STOP}
   */
  self.stopWatching = function stopWatching() {
    self._fsWatcher.unwatch(config.path);
    self._fsWatcher.removeListener('add', emitter.emitEmergedFileEvent);
  };
}
