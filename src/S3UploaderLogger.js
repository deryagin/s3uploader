module.exports = S3UploaderLogger;

function S3UploaderLogger() {

  var self = this;

  self.logSuccess = function (from, to) {
    console.log('%s SUCCESS: %s -> %s', new Date().toISOString(), from, to);
  };

  self.logError = function (error, from, to) {
    console.error('%s ERROR: %s -> %s', new Date().toISOString(), from, to, context.error.message);
  };
}
