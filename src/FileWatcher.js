var FSWatcher = require('chokidar').FSWatcher;
var EventType = require(s3uploader.ROOT_DIR + 'EventType');

module.exports = S3Uploader_FileWatcher;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Config.chokidar} config
 */
function S3Uploader_FileWatcher(emitter, config) {

  var self = this;

  /** @type {chokidar.FSWatcher} */
  var _fsWatcher = new FSWatcher(config.options);

  self.startWatching = function () {
    _fsWatcher.add(config.path);
    _fsWatcher.on('add', emitter.emitEmergedFileEvent);
  };

  self.stopWatching = function () {
    _fsWatcher.unwatch(config.path);
  };
}
