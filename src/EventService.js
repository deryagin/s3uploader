var EventEmitter = require('events').EventEmitter;
var EventType = require(s3uploader.ROOT_DIR + 'EventType');

module.exports = EventService;

function EventService() {

  var self = this;

  var _emitter = new EventEmitter();

  self.on = function (event, listener) {
    _emitter.on(event, listener);
    return self;
  };

  self.emitServiceStartEvent = function () {
    return _emitter.emit(EventType.SERVICE_START);
  };

  self.emitServiceStopEvent = function () {
    return _emitter.emit(EventType.SERVICE_STOP);
  };

  /**
   * @param {String} localPath
   * @param {fs.Stats} fileStats
   * @fires EventType.EMERGED_FILE -- это нужно вообще??
   */
  self.emitEmergedFileEvent = function (localPath, fileStats) {
    return _emitter.emit(EventType.EMERGED_FILE, localPath, fileStats);
  };

  self.emitProcessFileEvent = function (localPath, fileStats) {
    return _emitter.emit(EventType.PROCESS_FILE, localPath, fileStats);
  };

  self.emitMoveSucceedEvent = function (from, to) {
    return _emitter.emit(EventType.MOVE_SUCCEED, from, to);
  };

  self.emitMoveFailingEvent = function (error, from, to) {
    return _emitter.emit(EventType.MOVE_FAILING, error, from, to);
  };
}
