var TaskQueue = require('tasks-queue');
var EventType = require(s3uploader.ROOT_DIR + 'EventType');

module.exports = S3Uploader_LimitedQueue;

/**
 * @param {S3Uploader_Config.tasks_queue} config
 * @param {S3Uploader_EventService} emitter
 */
function S3Uploader_LimitedQueue(config, emitter) {

  var self = this;

  var FILE_ADDED_EVENT = 'file:added';

  /** @type {tasks-queue.TaskQueue} */
  var _taskQueue = new TaskQueue();

  /** @type {Jinn} - вызов jinn.done() завершает обработку текущего события https://github.com/tutukin/tasks-queue */
  var _jinn = null;

  /** @type {{localPath: 'String', fsStats: 'fs.Stats'}} - контекст текущего, обрабатываемого события. */
  var _context = null;

  (function _initialize() {
    _taskQueue.setMinTime(config.defaultInterval);
    _taskQueue.noautostop();
    _taskQueue.execute();
  })();

  (function _eventness() {
    _taskQueue.on(FILE_ADDED_EVENT, raiseProcessFileEvent)
  })();

  /**
   * @todo: разобраться, как вместо описания параметров
   * ссылаться на сигнатуру метода S3Uploader_EventService.emitEmergedFileEvent
   */
  self.addFileToQueue = function (localPath, fsStats) {
    _context = {
      'localPath': localPath,
      'fsStats': fsStats
    };
    queue.pushTask(FILE_ADDED_EVENT, _context)
  };

  self.continueProcessing = function () {
    // если все ок, то сбрасываем интервал ожидания обработки следующего события и
    // завершает его обработку вызовом _jinn.done()
    _taskQueue.setMinTime(config.defaultInterval);
    _jinn.done();
    _jinn = null;
  };

  self.slowDownProcessing = function () {
    // если ошибка, добавляем таск в конец очереди,
    // чтобы снова попытаться отправить файл в S3
    // и увеличиваем интервал между попытками
    slowDownTaskQueue();
    _taskQueue.pushTask('file:added', _context);
    _jinn.done();
    _jinn = null;
  };

  function raiseProcessFileEvent(jinn, context) {
    _jinn = jinn;
    _context = context;
    emitter.emitProcessFileEvent(context.localPath, context.fsStats);
  }

  function slowDownTaskQueue() {
    var retryInterval = config.intervalMultiplier * _taskQueue.getMinTime();
    var isOverInterval = config.maximumInterval < retryInterval;
    retryInterval = (isOverInterval ? config.maximumInterval : retryInterval);
    _taskQueue.setMinTime(retryInterval);
  }
}
