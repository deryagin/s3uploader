module.exports = S3Uploader_ClassLoader;

function S3Uploader_ClassLoader() {

  var self = this;

  /** @type {Object.<String, String>} - соответствие неймспейсов и путей в ФС */
  var _nsMap = {};

  /**
   * Загружает модуль проекта по full-qualified-classname.
   *
   * @param {String} qualifiedName
   * @return {Object|Function} - require.module.exports
   */
  self.require = function (qualifiedName) {
    var parsed = parseClassName(qualifiedName);
    var directory = findDirectory(parsed.namespace);
    return require(directory + parsed.className);
  };

  /**
   * Позволяет добавть резолвинг namespace -> FS path.
   *
   * @param {String} nsPrefix - неймспейс
   * @param {String} pathPrefix - абсолютный путь в ФС
   * @return {S3Uploader_ClassLoader}
   */
  self.addNamespace = function (nsPrefix, pathPrefix) {
    _nsMap[nsPrefix] = pathPrefix;
    return self;
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
//loader.addNamespace('S3Uploader', s3uploader.ROOTDIR + 'src/');
//
//var Logger = loader.require('S3Uploader_Logger');
//var logger = new Logger();
//logger.logSuccess('a', 'b');
