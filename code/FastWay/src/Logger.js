module.exports = S3Uploader_FastWay_Logger;

function S3Uploader_FastWay_Logger() {

  var self = this;

  self.logStart = function serviceStart() {
    console.log('%s SERVICE START...', new Date().toISOString());
  };

  self.logStop = function serviceStart() {
    console.log('%s SERVICE STOP...', new Date().toISOString());
  };

  self.logSuccess = function logSuccess(from, to) {
    console.log('%s SUCCESS: %s -> %s', new Date().toISOString(), from, to);
  };

  self.logError = function logError(error, from, to) {
    console.error('%s ERROR: %s -> %s', new Date().toISOString(), from, to, error.message);
  };
}
