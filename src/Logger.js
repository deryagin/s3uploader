module.exports = S3Uploader_Logger;

function S3Uploader_Logger() {

  var self = this;

  /**
   * @see {S3Uploader_EventService.emitMoveSucceedEvent}
   * @listens {S3Uploader_EventType.MOVE_SUCCEED}
   */
  self.logSuccess = function (from, to) {
    console.log('%s SUCCESS: %s -> %s', new Date().toISOString(), from, to);
  };

  /**
   * @see {S3Uploader_EventService.emitMoveFailingEvent}
   * @listens {S3Uploader_EventType.MOVE_FAILING}
   */
  self.logError = function (error, from, to) {
    console.error('%s ERROR: %s -> %s', new Date().toISOString(), from, to, context.error.message);
  };
}