//var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

module.exports = EventService;

//inherits(EventService, EventEmitter);

function EventService() {

  var _this = this;

  var _emitter = new EventEmitter();

  //(function _initialize() {
  //  EventEmitter.call(_this);
  //})();

  _this.start = function () {
    // генерирует событие EventType.SERVICE_START
  };

  _this.stop = function () {
    // генерирует событие EventType.SERVICE_STOP
  };

  _this.reset = function () {

  };
}
