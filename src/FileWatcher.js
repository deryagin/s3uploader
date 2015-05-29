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
  var _config = null;

  /** @type {events.EventEmitter} */
  var _emitter = null;

  /** @type {chokidar.FSWatcher} */
  var _fsWatcher = null;

  (function _initialize() {
    _config = config;
    _emitter = emitter;
    _fsWatcher = new FSWatcher(_config.options);
  })();

  /**
   * Если использовать такой подход, что каждый класс сам подписывается
   * на события, то логика событийной последовательности будет размазана
   * по многим классам. Намного лучше, еали она будет сосредоточена в одном
   * месте. См. object/index.js
   */
  //(function _eventness() {
  //  _emitter.on(EventType.EVENT_SERVICE_START, onEmitterStart)
  //  _emitter.on(EventType.EVENT_SERVICE_STOP, onEmitterStop)
  //})();

  _this.onEmitterStart = function () {
    _fsWatcher.add(_config.path);
    _fsWatcher.on('add', onFileAdded);
  };

  _this.onEmitterStop = function () {
    _fsWatcher.unwatch(_config.path);
  };

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
