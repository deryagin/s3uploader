var EventEmitter = require('events').EventEmitter;
var EventType = require(s3uploader.ROOT_DIR + 'EventType');

module.exports = EventService;

function EventService() {

  var _this = this;

  var _emitter = new EventEmitter();

  _this.on = function (event, listener) {
    _emitter.on(event, listener);
    return _this;
  };

  _this.emitServiceStartEvent = function () {
    return _emitter.emit(EventType.SERVICE_START);
  };

  _this.emitServiceStopEvent = function () {
    return _emitter.emit(EventType.SERVICE_STOP);
  };

  /**
   * @param {String} localPath
   * @param {fs.Stats} fileStats
   * @fires EventType.EMERGED_FILE -- это нужно вообще??
   */
  _this.emitEmergedFileEvent = function (localPath, fileStats) {
    return _emitter.emit(EventType.EMERGED_FILE, localPath, fileStats);
  };

  _this.emitProcessFileEvent = function (localPath, fileStats) {
    return _emitter.emit(EventType.PROCESS_FILE, localPath, fileStats);
  };

  _this.emitMoveSucceedEvent = function (from, to) {
    return _emitter.emit(EventType.MOVE_SUCCEED, from, to);
  };

  _this.emitMoveFailingEvent = function (error, from, to) {
    return _emitter.emit(EventType.MOVE_FAILING, error, from, to);
  };
}
