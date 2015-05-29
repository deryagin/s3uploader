var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

module.exports = Emitter;

inherits(Emitter, EventEmitter);

function Emitter() {

  var _this = this;

  (function _initialize() {
    EventEmitter.call(_this);
  })();
}
