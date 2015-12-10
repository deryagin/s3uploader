module.exports = S3Uploader_XunitWay_TestHarness;

// todo: очевидно этому классу тут не место
function S3Uploader_XunitWay_TestHarness() {

  var self = this;

  /**
   * Это метод удобно использовать там, где внутри callback не нужно что-то проверять.
   * А достаточно всего лишь передать done: _harness.setExpectedEvent(emitter, EventType.MOVE_SUCCEED, 100, done);
   *
   * @param {EventEmitter} emitter
   * @param {String} eventName
   * @param {Number} [timeout=1000]
   * @param {Function} callback
   */
  self.setExpectedEvent = function setExpectedEvent(emitter, eventName, timeout, callback) {
    var wasEventFired = false;
    timeout = timeout || 1000;

    emitter.on(eventName, function setWasEventFired() {
      wasEventFired = true;
      callback();
    });

    setTimeout(function () {
      if (!wasEventFired) {
        callback(new Error(util.format('event "%s" was not fired', eventName)));
      }
    }, timeout);
  }
}
