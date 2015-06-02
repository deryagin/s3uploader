module.exports = S3UploaderLogger;

function S3UploaderLogger() {

  var _this = this;

  _this.logSuccess = function (context) {
    console.log('%s SUCCESS: %s -> %s', new Date().toISOString(), context.from, context.to);
  };

  _this.logError = function (context) {
    console.error('%s ERROR: %s -> %s', new Date().toISOString(), context.from, context.to, context.error.message);
  };
}
