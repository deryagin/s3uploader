module.exports = S3Uploader_TestHarness;

// todo: очевидно этому классу тут не место
function S3Uploader_TestHarness() {

  var self = this;

  /**
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
