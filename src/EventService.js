var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var EventType = require('./EventType');

module.exports = EventService;

inherits(EventService, EventEmitter);

function EventService() {

  var _this = this;

  (function _initialize() {
    EventEmitter.call(_this);
  })();

  _this.start = function () {
    _this.emit(EventType.SERVICE_START);
  };

  _this.stop = function () {
    _this.emit(EventType.SERVICE_STOP);
  };
}
