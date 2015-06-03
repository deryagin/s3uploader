var knox = require('knox');
var EventType = require(s3uploader.ROOT_DIR + 'src/EventType');

module.exports = S3Client;

function S3Client(config, emitter) {

  var _this = this;

  var _s3Store = knox.createClient(config);

  (function _initialize() {

  })();

  (function _eventness() {

  })();

  _this.sendToStore = function (fileInfo) {
    var s3FilePath = buildS3SrotePath(fileInfo.localPath);
    var s3StoreRequest = createS3StoreRequest(s3FilePath, fileInfo.fileStats.size);
    var s3ResponseHandler = createS3ResponseHandler(fileInfo.localPath, s3StoreRequest.url);
    s3StoreRequest.on('response', s3ResponseHandler);
    fs.createReadStream(fileInfo.localPath).pipe(s3StoreRequest);
  };

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
    return _s3Store.put(storePath, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename=' + path.basename(storePath)
    });
  }

  function createS3ResponseHandler(localPath, s3StorePath) {
    return function (s3Response) {
      if (200 == s3Response.statusCode) {
        raiseMoveSucceedEvent(localPath, s3StorePath);
        return fs.unlink(localPath);
      }

      raiseMoveFailingEvent(new Error('S3 request has returned not "200 OK" code!'), localPath, s3StorePath)
    };
  }

  function raiseMoveSucceedEvent(from, to) {
    emitter.emit(EventType.MOVE_SUCCEED, {
      from: from,
      to: to
    });
  }

  function raiseMoveFailingEvent(error, from, to) {
    emitter.emit(EventType.MOVE_FAILING, {
      from: from,
      to: to,
      error: error
    });
  }

  function removeLocalFile() {
    fs.unlink(localPath);
  }
}
