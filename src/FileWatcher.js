var FSWatcher = require('chokidar').FSWatcher;

module.exports = S3Uploader_FileWatcher;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Config.chokidar} config
 */
function S3Uploader_FileWatcher(emitter, config) {

  var self = this;

  /** @type {chokidar.FSWatcher} */
  var _fsWatcher = new FSWatcher(config.options);

  /**
   * @see S3Uploader_EventService.emitServiceStartEvent
   */
  self.startWatching = function () {
    // todo: решить проблему, почему не резолвится?
    _fsWatcher.add(config.path);
    _fsWatcher.on('add', emitter.emitEmergedFileEvent);
  };

  /**
   * @see S3Uploader_EventService.emitServiceStopEvent
   */
  self.stopWatching = function () {
    _fsWatcher.unwatch(config.path);
  };
}
