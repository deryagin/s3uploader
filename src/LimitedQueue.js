var TaskQueue = require('tasks-queue');

module.exports = S3Uploader_LimitedQueue;

/**
 * @param {S3Uploader_EventService} emitter
 * @param {S3Uploader_Config.tasks_queue} config
 */
function S3Uploader_LimitedQueue(emitter, config) {

  var self = this;

  /** @type {tasks-queue.TaskQueue} */
  self._taskQueue = new TaskQueue();

  /** @type {{localPath: 'String', fsStats: 'fs.Stats'}} - контекст текущего, обрабатываемого события. */
  self._eventContext = null;

  /** @type {Jinn} - вызов jinn.done() завершает обработку текущего события https://github.com/tutukin/tasks-queue */
  self._jinn = null;

  (function _initialize() {
    self._taskQueue.setMinTime(config.defaultInterval);
    self._taskQueue.noautostop();
    self._taskQueue.execute();
  })();

  (function _eventness() {
    self._taskQueue.on('file:added', function raiseMoveNeededEvent(jinn, eventContext) {
      self._jinn = jinn;
      self._eventContext = eventContext;
      emitter.emitMoveNeededEvent(eventContext.localPath, eventContext.fsStats);
    })
  })();

  /**
   * @see {S3Uploader_EventService.emitEmergedFileEvent}
   * @listens {S3Uploader_EventType.EMERGED_FILE}
   */
  self.addFileToQueue = function addFileToQueue(localPath, fsStats) {
    self._taskQueue.pushTask('file:added', { 'localPath': localPath, 'fsStats': fsStats })
  };

  /**
   * @see {S3Uploader_EventService.emitMoveSucceedEvent}
   * @listens {S3Uploader_EventType.MOVE_SUCCEED}
   */
  self.speedUpProcessing = function speedUpProcessing() {
    // если все ок, то сбрасываем интервал ожидания обработки следующего события и
    // завершаем обработку текущего события вызовом _jinn.done()
    self._taskQueue.setMinTime(config.defaultInterval);
    self._jinn.done();
  };

  /**
   * @see {S3Uploader_EventService.emitMoveFailingEvent}
   * @listens {S3Uploader_EventType.MOVE_FAILING}
   */
  self.slowDownProcessing = function slowDownProcessing() {
    // поскольку произошла ошибка, увеличиваем интервал между попытками
    var retryInterval = config.intervalMultiplier * self._taskQueue.getMinTime();
    var isOverInterval = config.maximumInterval < retryInterval;
    retryInterval = (isOverInterval ? config.maximumInterval : retryInterval);
    self._taskQueue.setMinTime(retryInterval);

    // завершаем обработку текущего события вызовом _jinn.done()
    // поскольку произошла ошибка, добавляем таск в конец очереди,
    // чтобы снова попытаться его выполнить
    self._jinn.done();
    self._taskQueue.pushTask('file:added', self._eventContext);
  };
}
