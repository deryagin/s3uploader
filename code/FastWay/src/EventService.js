var EventEmitter = require('events').EventEmitter;
var EventType = s3uploader.require('S3Uploader_EventType');

module.exports = S3Uploader_FastWay_EventService;

function S3Uploader_FastWay_EventService() {

  var self = this;

  /** @type {events.EventEmitter} */
  self._emitter = new EventEmitter();

  /**
   * Позволяет подписаться на какое-либо событие.
   *
   * @see {events.EventEmitter.on}
   * @param {String} event
   * @param {Function} listener
   * @returns {S3Uploader_FastWay_EventService}
   */
  self.on = function on(event, listener) {
    self._emitter.on(event, listener);
    return self;
  };

  /**
   * Проверяет, что событие разрешено и генерирует его.
   *
   * Метод был добавлен скорее для уброщения дебага.
   * Т.к. добавление в него console.log(eventType);
   * позволяет логировать события.
   *
   * @see {EventEmitter.emit}
   * @returns {Boolean}
   */
  self.emit = function allowableEmit() {
    var eventType = arguments[0]; //console.log(eventType);
    if (EventType.isValid(eventType)) {
      return self._emitter.emit.apply(self._emitter, arguments);
    }
    throw new Error('unknown EventType = ' + eventType);
  };

  /**
   * @emits {S3Uploader_FastWay_EventType.SERVICE_START}
   */
  self.emitServiceStartEvent = function emitServiceStartEvent() {
    return self.emit(EventType.SERVICE_START);
  };

  /**
   * @emits {S3Uploader_FastWay_EventType.SERVICE_STOP}
   */
  self.emitServiceStopEvent = function emitServiceStopEvent() {
    return self.emit(EventType.SERVICE_STOP);
  };

  /**
   * @param {String} localPath
   * @param {fs.Stats} fsStats
   * @emits {S3Uploader_EventType.EMERGED_FILE}
   */
  self.emitEmergedFileEvent = function emitEmergedFileEvent(localPath, fsStats) {
    return self.emit(EventType.EMERGED_FILE, localPath, fsStats);
  };

  /**
   * @param {String} localPath
   * @param {fs.Stats} fsStats
   * @emits {S3Uploader_EventType.MOVE_NEEDED}
   */
  self.emitMoveNeededEvent = function emitMoveNeededEvent(localPath, fsStats) {
    return self.emit(EventType.MOVE_NEEDED, localPath, fsStats);
  };

  /**
   * @param {String} from
   * @param {String} to
   * @emits {S3Uploader_EventType.MOVE_SUCCEED}
   */
  self.emitMoveSucceedEvent = function emitMoveSucceedEvent(from, to) {
    return self.emit(EventType.MOVE_SUCCEED, from, to);
  };

  /**
   * @param {Error} error
   * @param {String} from
   * @param {String} to
   * @emits {S3Uploader_EventType.MOVE_FAILING}
   */
  self.emitMoveFailingEvent = function emitMoveFailingEvent(error, from, to) {
    return self.emit(EventType.MOVE_FAILING, error, from, to);
  };
}
