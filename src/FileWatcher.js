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

  var _this = this;

  /** @type {chokidar.FSWatcher} */
  var _fsWatcher = new FSWatcher(config.options);

  _this.startWatching = function () {
    _fsWatcher.add(config.path);
    _fsWatcher.on('add', raiseEmergedFileEvent);
  };

  _this.stopWatching = function () {
    _fsWatcher.unwatch(config.path);
  };

  /**
   * @todo: возможно это делегирование лишнее
   * @param {String} localPath
   * @param {fs.Stats} fileStats
   */
  function raiseEmergedFileEvent(localPath, fileStats) {
    emitter.emitEmergedFileEvent(localPath, fileStats);
  }
}
