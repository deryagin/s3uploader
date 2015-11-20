var fs = require('fs');
var path = require('path');
var util = require('util');
var knox = require('knox');

module.exports = S3Uploader_S3Sender;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Configuration.knox} config
 */
function S3Uploader_S3Sender(emitter, config) {

  var self = this;

  /** @type {S3Uploader_EventService} */
  self._emitter = emitter;

  /** @type {S3Uploader_Configuration} */
  self._config = config;

  /** @type {knox.Client} */
  self._s3Client = null;

  self._populate = function _populate() {
    self._s3Client = knox.createClient(config);
  };

  (S3Uploader_S3Sender._initialize || function _initialize() {
    self._populate();
  })();

  /**
   * @see {S3Uploader_EventService.emitMoveNeededEvent}
   * @listens {S3Uploader_EventType.MOVE_NEEDED}
   */
  self.moveToStore = function moveToStore(localPath, fsStats) {
    var s3FilePath = self.buildS3SrotePath(localPath);
    var s3StoreRequest = createS3StoreRequest(s3FilePath, fsStats.size);
    var s3ResponseHandler = createS3ResponseHandler(localPath, s3StoreRequest.url);
    s3StoreRequest.on('response', s3ResponseHandler);
    // todo: подумать про обработку ошибок во время стриминга ФС
    fs.createReadStream(localPath).pipe(s3StoreRequest);
  };

  self.buildS3SrotePath = function buildS3SrotePath(filePath) {
    var fileParts = path.basename(filePath).split('_');
    var vpbxId = fileParts[0];
    var fileName = fileParts[1];
    return '/vpbx/' + vpbxId + '/records/' + fileName;
  };

  function createS3StoreRequest(storePath, fileSize) {
    // Заголовок Content-Disposition, как и другие, сохранится
    // в CEPH как свойство зугруженного файла. Впоследствии, этот
    // заголовок будет добавляться в респонз при скачивании
    // файла из CEPH по прямому линку. Content-Disposition нужен,
    // чтобы браузер не открывал файл (mp3), а предлагал его сохранить.
    return self._s3Client.put(storePath, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename=' + path.basename(storePath)
    });
  }

  function createS3ResponseHandler(localPath, s3Url) {
    return function s3ResponseHandler(s3Response) {
      if (200 == s3Response.statusCode) {
        emitter.emitMoveSucceedEvent(localPath, s3Url);
        return fs.unlink(localPath);
      }

      var error = new Error(util.format('S3 response has returned "%d" code!', s3Response.statusCode));
      emitter.emitMoveFailingEvent(error, localPath, s3Url);
    };
  }
}
