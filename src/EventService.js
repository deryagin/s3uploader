var EventEmitter = require('events').EventEmitter;
var EventType = require(s3uploader.ROOT_DIR + 'EventType');

module.exports = S3Uploader_EventService;

function S3Uploader_EventService() {

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
   * @emits EventType.EMERGED_FILE -- это нужно вообще??
   * @param {String} localPath
   * @param {fs.Stats} fsStats
   */
  self.emitEmergedFileEvent = function (localPath, fsStats) {
    return _emitter.emit(EventType.EMERGED_FILE, localPath, fsStats);
  };

  self.emitProcessFileEvent = function (localPath, fsStats) {
    return _emitter.emit(EventType.PROCESS_FILE, localPath, fsStats);
  };

  self.emitMoveSucceedEvent = function (from, to) {
    return _emitter.emit(EventType.MOVE_SUCCEED, from, to);
  };

  self.emitMoveFailingEvent = function (error, from, to) {
    return _emitter.emit(EventType.MOVE_FAILING, error, from, to);
  };
}
