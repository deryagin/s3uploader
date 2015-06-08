var TaskQueue = require('tasks-queue');

module.exports = S3Uploader_LimitedQueue;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Config.tasks_queue} config
 */
function S3Uploader_LimitedQueue(emitter, config) {

  var self = this;

  /** @type {String} - внутреннее событие для _taskQueue */
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
    _taskQueue.on(FILE_ADDED_EVENT, raiseMoveNeededEvent)
  })();

  /**
   * @listens {S3Uploader_EventService#emitEmergedFileEvent}
   */
  self.addFileToQueue = function (localPath, fsStats) {
    _context = {
      'localPath': localPath,
      'fsStats': fsStats
    };
    queue.pushTask(FILE_ADDED_EVENT, _context)
  };

  /**
   * @listens {S3Uploader_EventService#emitMoveSucceedEvent}
   */
  self.continueProcessing = function () {
    // если все ок, то сбрасываем интервал ожидания обработки следующего события и
    // завершает его обработку вызовом _jinn.done()
    _taskQueue.setMinTime(config.defaultInterval);
    _jinn.done();
    _jinn = null;
  };

  /**
   * @listens {S3Uploader_EventService#emitMoveFailingEvent}
   */
  self.slowDownProcessing = function () {
    // если ошибка, добавляем таск в конец очереди,
    // чтобы снова попытаться отправить файл в S3
    // и увеличиваем интервал между попытками
    slowDownTaskQueue();
    _taskQueue.pushTask('file:added', _context);
    _jinn.done();
    _jinn = null;
  };

  function raiseMoveNeededEvent(jinn, context) {
    _jinn = jinn;
    _context = context;
    emitter.emitMoveNeededEvent(context.localPath, context.fsStats);
  }

  function slowDownTaskQueue() {
    var retryInterval = config.intervalMultiplier * _taskQueue.getMinTime();
    var isOverInterval = config.maximumInterval < retryInterval;
    retryInterval = (isOverInterval ? config.maximumInterval : retryInterval);
    _taskQueue.setMinTime(retryInterval);
  }
}
