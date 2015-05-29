var EventType = require('./EventType');
var FileWatcher = require('./FileWatcher');
var LimitedQueue = require('./LimitedQueue');
var S3Client = require('./S3Client');
var EventService = require('./EventService');

module.exports = Application;

function Application(config) {

  var _this = this;

  var _config = config;

  var _eventService = new EventService();

  var _fileWatcher = new FileWatcher(_config, _eventService);

  var _limitedQueue = new LimitedQueue(_config, _eventService);

  var _s3Client = new S3Client(_config, _eventService);

  (function _eventness() {
    _eventService.on(EventType.EVENT_SERVICE_START, _fileWatcher.startWatching);
    _eventService.on(EventType.FSWATCER_FILE_ADDED, _limitedQueue.addFileToQueue);
    _eventService.on(EventType.QUEUE_FILE_ADDED, _s3Client.sendToStore);
    _eventService.on(EventType.S3CLIENT_FILE_SAVED, _limitedQueue.continueProcessing);
    _eventService.on(EventType.EVENT_SERVICE_STOP, _fileWatcher.onEmitterStop);
  })();

  _this.start = function () {
    _eventService.start();
  };
}
