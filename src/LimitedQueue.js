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

  /** @type {{localPath: 'String', fsStats: 'fs.Stats'}} - контекст текущего, обрабатываемого события. */
  var _eventContext = null;

  /** @type {Jinn} - вызов jinn.done() завершает обработку текущего события https://github.com/tutukin/tasks-queue */
  var _jinn = null;

  (function _initialize() {
    _taskQueue.setMinTime(config.defaultInterval);
    _taskQueue.noautostop();
    _taskQueue.execute();
  })();

  (function _eventness() {
    _taskQueue.on(FILE_ADDED_EVENT, raiseMoveNeededEvent)
  })();

  /**
   * @see {S3Uploader_EventService.emitEmergedFileEvent}
   * @listens {S3Uploader_EventType.EMERGED_FILE}
   */
  self.addFileToQueue = function addFileToQueue(localPath, fsStats) {
    _taskQueue.pushTask(FILE_ADDED_EVENT, { 'localPath': localPath, 'fsStats': fsStats })
  };

  /**
   * @see {S3Uploader_EventService.emitMoveSucceedEvent}
   * @listens {S3Uploader_EventType.MOVE_SUCCEED}
   */
  self.speedUpProcessing = function speedUpProcessing() {
    // если все ок, то сбрасываем интервал ожидания обработки следующего события и
    // завершаем обработку текущего события вызовом _jinn.done()
    _taskQueue.setMinTime(config.defaultInterval);
    _jinn.done();
    _jinn = null;
  };

  /**
   * @see {S3Uploader_EventService.emitMoveFailingEvent}
   * @listens {S3Uploader_EventType.MOVE_FAILING}
   */
  self.slowDownProcessing = function slowDownProcessing() {
    // если ошибка, добавляем таск в конец очереди, чтобы снова попытаться отправить файл в S3
    // увеличиваем интервал между попытками, завершаем обработку текущего события вызовом _jinn.done()
    slowDownTaskQueue();
    _taskQueue.pushTask(FILE_ADDED_EVENT, _eventContext);
    _jinn.done();
    _jinn = null;
  };

  /**
   * @param jinn
   * @param eventContext
   * @listens {FILE_ADDED_EVENT}
   */
  function raiseMoveNeededEvent(jinn, eventContext) {
    _jinn = jinn;
    _eventContext = eventContext;
    emitter.emitMoveNeededEvent(eventContext.localPath, eventContext.fsStats);
  }

  function slowDownTaskQueue() {
    var retryInterval = config.intervalMultiplier * _taskQueue.getMinTime();
    var isOverInterval = config.maximumInterval < retryInterval;
    retryInterval = (isOverInterval ? config.maximumInterval : retryInterval);
    _taskQueue.setMinTime(retryInterval);
  }
}
