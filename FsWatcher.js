var inherits = require('util').inherits;
var chokidar = require('chokidar');
var config = require('./config');
var EventType = require('EventType');

module.exports = FsWatcher;

/**
 * @todo избавиться от multiple definitions для config
 * @param {config} config
 * @param {events.EventEmitter} emitter
 */
function FsWatcher(config, emitter) {

  var _this = this;

  /** @type {config} */
  var _config = config;

  /** @type {events.EventEmitter} */
  var _emitter = emitter;

  /** @type {chokidar.FSWatcher} */
  var _chokidar = null;

  (function _initialize() {
    _chokidar = chokidar.watch(_config.path, _config.options);
    _chokidar.on('add', onFileAdded);
  })();

  /**
   * @param {String} localPath
   * @param {fs.Stats} fileStats
   * @fires EventType.FSWATCER_FILE_ADDED
   */
  function onFileAdded(localPath, fileStats) {
    _emitter.emit(EventType.FSWATCER_FILE_ADDED, {
      'localPath': localPath,
      'fileStats': fileStats
    });
  }
}
