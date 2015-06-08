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

  /**
   * @emits S3Uploader_EventType.SERVICE_START
   */
  self.emitServiceStartEvent = function () {
    return _emitter.emit(EventType.SERVICE_START);
  };

  /**
   * @emits S3Uploader_EventType.SERVICE_STOP
   */
  self.emitServiceStopEvent = function () {
    return _emitter.emit(EventType.SERVICE_STOP);
  };

  /**
   * @emits S3Uploader_EventType.EMERGED_FILE
   * @param {String} localPath
   * @param {fs.Stats} fsStats
   */
  self.emitEmergedFileEvent = function (localPath, fsStats) {
    return _emitter.emit(EventType.EMERGED_FILE, localPath, fsStats);
  };

  /**
   * @emits S3Uploader_EventType.MOVE_NEEDED
   * @param {String} localPath
   * @param {fs.Stats} fsStats
   */
  self.emitMoveNeededEvent = function (localPath, fsStats) {
    return _emitter.emit(EventType.MOVE_NEEDED, localPath, fsStats);
  };

  /**
   * @emits S3Uploader_EventType.MOVE_SUCCEED
   * @param {String} from
   * @param {String} to
   */
  self.emitMoveSucceedEvent = function (from, to) {
    return _emitter.emit(EventType.MOVE_SUCCEED, from, to);
  };

  /**
   * @emits S3Uploader_EventType.MOVE_FAILING
   * @param {Error} error
   * @param {String} from
   * @param {String} to
   */
  self.emitMoveFailingEvent = function (error, from, to) {
    return _emitter.emit(EventType.MOVE_FAILING, error, from, to);
  };
}
