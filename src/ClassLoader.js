module.exports = S3Uploader_ClassLoader;

function S3Uploader_ClassLoader() {

  var self = this;

  var _nsMap = {};

  self.require = function (qualifiedName) {
    var parsed = parseClassName(qualifiedName);
    var directory = findDirectory(parsed.namespace);
    return require(directory + parsed.className);
  };

  self.addNamespace = function (nsPrefix, pathPrefix) {
    _nsMap[nsPrefix] = pathPrefix;
  };

  function parseClassName(qualifiedName) {
    var lastSeparator = qualifiedName.lastIndexOf('_');
    return {
      namespace: qualifiedName.slice(0, lastSeparator),
      className: qualifiedName.slice(lastSeparator + 1)
    };
  }

  function findDirectory(namespace) {
    for (var nsName in _nsMap) {
      if (_nsMap.hasOwnProperty(nsName) && 0 === namespace.indexOf(nsName)) {
        var baseDir = _nsMap[nsName];
        var restPath = namespace.replace(nsName, '').replace('_', '/');
        return baseDir + restPath;
      }
    }
  }
}

//require('../global');
//var loader = new S3Uploader_ClassLoader();
//loader.addNamespace('S3Uploader', s3uploader.ROOT_DIR + 'src/');
//
//var Logger = loader.require('S3Uploader_Logger');
//var logger = new Logger();
//logger.logSuccess('a', 'b');
