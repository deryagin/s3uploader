var EventType = require('EventType');
var FSWatcher = require('chokidar').FSWatcher;

module.exports = FileWatcher;

/**
 * @todo избавиться от multiple definitions для config
 * @param {config} config
 * @param {events.EventEmitter} emitter
 */
function FileWatcher(config, emitter) {

  var _this = this;

  /** @type {config} */
  var _config = config;

  /** @type {events.EventEmitter} */
  var _emitter = emitter;

  /** @type {chokidar.FSWatcher} */
  var _fsWatcher = new FSWatcher(_config.options);

  _this.startWatching = function () {
    _fsWatcher.add(_config.path);
    _fsWatcher.on('add', onFileAdded);
  };

  _this.stopWatching = function () {
    _fsWatcher.unwatch(_config.path);
  };

  /**
   * @param {String} localPath
   * @param {fs.Stats} fileStats
   * @fires EventType.FSWATCER_FILE_ADDED
   */
  function onFileAdded(localPath, fileStats) {
    _emitter.emit(EventType.EMERGED_FILE, {
      'localPath': localPath,
      'fileStats': fileStats
    });
  }
}
