module.exports = S3Uploader_Logger;

function S3Uploader_Logger() {

  var self = this;

  /**
   * @see {S3Uploader_EventService.emitServiceStartEvent}
   * @listens {S3Uploader_EventType.SERVICE_START}
   */
  self.logStart = function serviceStart() {
    console.log('%s SERVICE START...', new Date().toISOString());
  };

  /**
   * @see {S3Uploader_EventService.emitServiceStopEvent}
   * @listens {S3Uploader_EventType.SERVICE_STOP}
   */
  self.logStop = function serviceStart() {
    console.log('%s SERVICE STOP...', new Date().toISOString());
  };

  /**
   * @see {S3Uploader_EventService.emitMoveSucceedEvent}
   * @listens {S3Uploader_EventType.MOVE_SUCCEED}
   */
  self.logSuccess = function logSuccess(from, to) {
    console.log('%s SUCCESS: %s -> %s', new Date().toISOString(), from, to);
  };

  /**
   * @see {S3Uploader_EventService.emitMoveFailingEvent}
   * @listens {S3Uploader_EventType.MOVE_FAILING}
   */
  self.logError = function logError(error, from, to) {
    console.error('%s ERROR: %s -> %s', new Date().toISOString(), from, to, error.message);
  };
}
