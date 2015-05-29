var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

module.exports = EventEmitter;

inherits(EventEmitter, EventEmitter);

function EventEmitter() {

  var _this = this;

  (function _initialize() {
    EventEmitter.call(_this);
  })();

  _this.start = function () {

  };

  _this.pause = function () {

  };

  _this.stop = function () {

  };
}
