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

  };

  _this.stop = function () {

  };

  _this.reset = function () {

  };
}
