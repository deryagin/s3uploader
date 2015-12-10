var FSWatcher = require('chokidar').FSWatcher;

module.exports = S3Uploader_FastWay_FileWatcher;

/**
 * @param {S3Uploader_FastWay_EventService} emitter
 * @param {S3Uploader_FastWay_Configuration.chokidar} config
 */
function S3Uploader_FastWay_FileWatcher(emitter, config) {

  var self = this;

  /** @type {FSWatcher} */
  self._fsWatcher = new FSWatcher(config.options);

  self.startWatching = function startWatching() {
    self._fsWatcher.add(config.path);
    self._fsWatcher.on('add', emitter.emitEmergedFileEvent);
  };

  self.stopWatching = function stopWatching() {
    self._fsWatcher.unwatch(config.path);
    self._fsWatcher.removeListener('add', emitter.emitEmergedFileEvent);
  };
}
