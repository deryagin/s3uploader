var fs = require('fs');
var knox = require('knox');

module.exports = S3Uploader_S3Sender;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Config.knox} config
 */
function S3Uploader_S3Sender(emitter, config) {

  var self = this;

  /** @type {knox.Client} */ //todo: почему не резолввится?
  var _s3Client = knox.createClient(config);

  /**
   * @listens {S3Uploader_EventService#emitMoveNeededEvent}
   */
  self.moveToStore = function (localPath, fsStats) {
    var s3FilePath = buildS3SrotePath(localPath);
    var s3StoreRequest = createS3StoreRequest(s3FilePath, fsStats.size);
    var s3ResponseHandler = createS3ResponseHandler(localPath, s3StoreRequest.url);
    s3StoreRequest.on('response', s3ResponseHandler);
    fs.createReadStream(localPath).pipe(s3StoreRequest);
  };

  /**
   * @todo: вынести в конфиг
   */
  function buildS3SrotePath(filePath) {
    var fileParts = path.basename(filePath).split('_');
    var vpbxId = fileParts[0];
    var fileName = fileParts[1];
    return '/vpbx/' + vpbxId + '/records/' + fileName;
  }

  function createS3StoreRequest(storePath, fileSize) {
    // Заголовок Content-Disposition, как и другие, сохранится
    // в CEPH как свойство зугруженного файла. Впоследствии, этот
    // заголовок будет добавляться в респонз при скачивании
    // файла из CEPH по прямому линку. Content-Disposition нужен,
    // чтобы файл (mp3) не открывался в браузере, а предлагал сохраниться.
    return _s3Client.put(storePath, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename=' + path.basename(storePath)
    });
  }

  // todo: подумать, как избавиться от этого замыкания
  function createS3ResponseHandler(localPath, s3Url) {
    return function (s3Response) {
      if (200 == s3Response.statusCode) {
        emitter.emitMoveSucceedEvent(localPath, s3Url);
        return fs.unlink(localPath);
      }

      var error = new Error('S3 request has returned not "200 OK" code!');
      emitter.emitMoveFailingEvent(error, localPath, s3Url);
    };
  }
}
