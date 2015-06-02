var EventType = require(s3uploader.ROOT_DIR + 'EventType');
var FileWatcher = require(s3uploader.ROOT_DIR + 'FileWatcher');
var LimitedQueue = require(s3uploader.ROOT_DIR + 'LimitedQueue');
var S3Client = require(s3uploader.ROOT_DIR + 'S3Client');
var EventService = require(s3uploader.ROOT_DIR + 'EventService');

module.exports = Application;

function Application(config) {

  var _this = this;

  var _eventService = new EventService();

  var _fileWatcher = new FileWatcher(config.chokidar, _eventService);

  var _limitedQueue = new LimitedQueue(config.tasks_queue, _eventService);

  var _s3Client = new S3Client(config.knox, _eventService);

  (function _eventness() {
    _eventService.on(EventType.SERVICE_START, _fileWatcher.startWatching);
    _eventService.on(EventType.EMERGED_FILE, _limitedQueue.addFileToQueue);
    _eventService.on(EventType.PROCESS_FILE, _s3Client.sendToStore);
    _eventService.on(EventType.MOVE_SUCCEED, _limitedQueue.continueProcessing);
    _eventService.on(EventType.MOVE_FAILING, _limitedQueue.slowDownProcessing);
    _eventService.on(EventType.SERVICE_STOP, _fileWatcher.stopWatching);
  })();

  _this.start = function () {
    _eventService.start();
  };
}
