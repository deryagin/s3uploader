module.exports = S3Uploader_XunitWay_Autoloader;

/**
 * @param {String} projectRoot - абсолютный путь к корню проекта
 * @param {String} relativeNsMap - соответствие неймспейсов и относительных путей в ФС
 * @example {"S3Uploader": "src/"}
 */
function S3Uploader_XunitWay_Autoloader(projectRoot, relativeNsMap) {

  var self = this;

  /** @type {Object} - соответствие неймспейсов и абсолютных путей в ФС. */
  var _absoluteNsMap = {};

  (function _initialize() {
    if (projectRoot && relativeNsMap) {
      for (var namespace in relativeNsMap) {
        var relativeDir = relativeNsMap[namespace];
        _absoluteNsMap[namespace] = projectRoot + relativeDir;
      }
    }
  })();

  /**
   * Загружает модуль проекта по full-qualified-classname.
   *
   * @param {String} qualifiedName
   * @return {Object|Function} - require.module.exports
   */
  self.require = function require(qualifiedName) {
    var parsed = parseClassName(qualifiedName);
    var directory = findDirectory(parsed.namespace);
    return module.require(directory + parsed.className);
  };

  /**
   * Позволяет добавть резолвинг namespace -> FS path.
   *
   * @param {String} projectRoot - абсолютный путь к корню проекта
   * @param {String} relativeNsMap - соответствие неймспейсов и относительных путей в ФС
   * @return {S3Uploader_XunitWay_Autoloader}
   */
  self.addNamespaces = function addNamespaces(projectRoot, relativeNsMap) {
    for (var namespace in relativeNsMap) {
      var relativeDir = relativeNsMap[namespace];
      var absoluteDir = projectRoot + relativeDir;
      _absoluteNsMap[namespace] = absoluteDir;
    }
    return self;
  };

  /**
   * Возвращает список загруженных модулей проекта. Преднозначен для дебага.
   * @todo: возможно этому методу тут не место?
   * @returns {Object.<String>, <String>}
   */
  self.require.loaded = function loaded() {
    var loaded = {};
    for (var filename in require.cache) {
      var exports = require.cache[filename].exports;
      var name = ('function' === typeof(exports) ? exports.name : filename.replace(s3uploader.ROOTDIR, ''));
      if (-1 === filename.indexOf('node_modules')) {
        loaded[name] = filename;
      }
    }
    return loaded;
  };

  function parseClassName(qualifiedName) {
    var lastSeparator = qualifiedName.lastIndexOf('_');
    return {
      namespace: qualifiedName.slice(0, lastSeparator),
      className: qualifiedName.slice(lastSeparator + 1)
    };
  }

  function findDirectory(namespace) {
    for (var nsName in _absoluteNsMap) {
      if (/*_absoluteNsMap.hasOwnProperty(nsName) && */0 === namespace.indexOf(nsName)) {
        var namespaceDir = _absoluteNsMap[nsName];
        var relativeClassDir = namespace.replace(nsName, '').replace('_', '/');
        return namespaceDir + relativeClassDir;
      }
    }
  }
}
