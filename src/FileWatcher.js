var FSWatcher = require('chokidar').FSWatcher;
var EventType = require(s3uploader.ROOT_DIR + 'EventType');

module.exports = FileWatcher;

/**
 * @todo избавиться от multiple definitions для config
 * @param {Object} config
 * @param {String} config.path
 * @param {Object} config.options
 * @param {EventService} emitter
 */
function FileWatcher(config, emitter) {

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
