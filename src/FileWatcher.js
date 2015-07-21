var FSWatcher = require('chokidar').FSWatcher;

module.exports = S3Uploader_FileWatcher;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Configuration.chokidar} config
 */
function S3Uploader_FileWatcher(emitter, config) {

  var self = this;

  /** @type {chokidar.FSWatcher} */
  var _fsWatcher = new FSWatcher(config.options);

  /**
   * @see {S3Uploader_EventService.emitServiceStartEvent}
   * @listens {S3Uploader_EventType.SERVICE_START}
   */
  self.startWatching = function startWatching() {
    // todo: решить проблему, почему не резолвится?
    _fsWatcher.add(config.path);
    _fsWatcher.on('add', emitter.emitEmergedFileEvent);
  };

  /**
   * @see {S3Uploader_EventService.emitServiceStopEvent}
   * @listens {S3Uploader_EventType.SERVICE_STOP}
   */
  self.stopWatching = function stopWatching() {
    _fsWatcher.unwatch(config.path);
  };
}
