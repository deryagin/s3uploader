/**
 * Неймспейс для всех глобальных переменных этого проекта.
 *
 * @type {Object}
 */
global.s3uploader = {

  /**
   * Абсолютный путь к корневой директории проекта.
   *
   * @type {String}
   */
  ROOTDIR: __dirname + '/',

  /**
   * Метод для загрузки классов.
   *
   * @type {S3Uploader_ClassLoader.require}
   */
  require: null
};
