module.exports = S3Uploader_Logger;

function S3Uploader_Logger() {

  var self = this;

  self.logSuccess = function (from, to) {
    console.log('%s SUCCESS: %s -> %s', new Date().toISOString(), from, to);
  };

  self.logError = function (error, from, to) {
    console.error('%s ERROR: %s -> %s', new Date().toISOString(), from, to, context.error.message);
  };
}
