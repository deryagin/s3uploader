var EventEmitter = require('events').EventEmitter;
var EventType = s3uploader.require('S3Uploader_EventType');

module.exports = S3Uploader_EventService;

function S3Uploader_EventService() {

  var self = this;

  /** @type {events.EventEmitter} */
  self._emitter = new EventEmitter();

  /**
   * Позволяет подписаться на какое-либо событие.
   *
   * @see {events.EventEmitter.on}
   * @param {String} event
   * @param {Function} listener
   * @returns {S3Uploader_EventService}
   */
  self.on = function on(event, listener) {
    self._emitter.on(event, listener);
    return self;
  };

  /**
   * @emits {S3Uploader_EventType.SERVICE_START}
   */
  self.emitServiceStartEvent = function emitServiceStartEvent() {
    return self._emitter.emit(EventType.SERVICE_START);
  };

  /**
   * @emits {S3Uploader_EventType.SERVICE_STOP}
   */
  self.emitServiceStopEvent = function emitServiceStopEvent() {
    return self._emitter.emit(EventType.SERVICE_STOP);
  };

  /**
   * @param {String} localPath
   * @param {fs.Stats} fsStats
   * @emits {S3Uploader_EventType.EMERGED_FILE}
   */
  self.emitEmergedFileEvent = function emitEmergedFileEvent(localPath, fsStats) {
    return self._emitter.emit(EventType.EMERGED_FILE, localPath, fsStats);
  };

  /**
   * @param {String} localPath
   * @param {fs.Stats} fsStats
   * @emits {S3Uploader_EventType.MOVE_NEEDED}
   */
  self.emitMoveNeededEvent = function emitMoveNeededEvent(localPath, fsStats) {
    return self._emitter.emit(EventType.MOVE_NEEDED, localPath, fsStats);
  };

  /**
   * @param {String} from
   * @param {String} to
   * @emits {S3Uploader_EventType.MOVE_SUCCEED}
   */
  self.emitMoveSucceedEvent = function emitMoveSucceedEvent(from, to) {
    return self._emitter.emit(EventType.MOVE_SUCCEED, from, to);
  };

  /**
   * @param {Error} error
   * @param {String} from
   * @param {String} to
   * @emits {S3Uploader_EventType.MOVE_FAILING}
   */
  self.emitMoveFailingEvent = function emitMoveFailingEvent(error, from, to) {
    return self._emitter.emit(EventType.MOVE_FAILING, error, from, to);
  };
}
