/**
 * Неймспейс для всех глобальных переменных этого проекта.
 *
 * @type {Object}
 */
global.s3uploader = {

  /** @type {String} - абсолютный путь к корневой директории проекта. */
  ROOTDIR: __dirname + '/',

  /** @type {S3Uploader_Autoloader.require} - метод для загрузки классов. */
  require: null
};
