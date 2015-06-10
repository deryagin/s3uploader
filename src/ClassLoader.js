module.exports = S3Uploader_ClassLoader;

/**
 * @param {S3Uploader_Config.classLoader} config
 */
function S3Uploader_ClassLoader(config) {

  var self = this;

  /** @type {Object.<String, String>} - соответствие неймспейсов и путей в ФС */
  var _nsMap = config.nsMap || {};

  /**
   * Загружает модуль проекта по full-qualified-classname.
   *
   * @param {String} qualifiedName
   * @return {Object|Function} - require.module.exports
   */
  self.require = function require(qualifiedName) {
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
  self.addNamespace = function addNamespace(nsPrefix, pathPrefix) {
    _nsMap[nsPrefix] = pathPrefix;
    return self;
  };

  /**
   * Возвращает список загруженных модулей проекта. Преднозначен для дебага.
   * @todo: возможно этому методу тут не место?
   * @returns {Object.<String>, <String>}
   */
  self.require.loaded = function loaded() {
    var loaded = {};
    var cache = require.cache;
    for (var filename in cache) {
      var exports = cache[filename].exports;
      var isFunction = typeof(exports) === 'function';
      var key = (isFunction ? exports.name : filename.replace(s3uploader.ROOTDIR, ''));

      if (-1 === filename.indexOf('node_modules')) {
        loaded[key] = filename;
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
    for (var nsName in _nsMap) {
      if (_nsMap.hasOwnProperty(nsName) && 0 === namespace.indexOf(nsName)) {
        var baseDir = _nsMap[nsName];
        var restPath = namespace.replace(nsName, '').replace('_', '/');
        return baseDir + restPath;
      }
    }
  }
}
