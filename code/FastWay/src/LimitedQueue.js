var TaskQueue = require('tasks-queue');

module.exports = S3Uploader_FastWay_LimitedQueue;

/**
 * @param {S3Uploader_FastWay_EventService} emitter
 * @param {S3Uploader_FastWay_Configuration.tasks_queue} config
 */
function S3Uploader_FastWay_LimitedQueue(emitter, config) {

  var self = this;

  /** @type {TaskQueue} */
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

  self.addFileToQueue = function addFileToQueue(localPath, fsStats) {
    self._taskQueue.pushTask('file:added', { 'localPath': localPath, 'fsStats': fsStats })
  };

  self.speedUpProcessing = function speedUpProcessing() {
    // если все ок, то сбрасываем интервал ожидания обработки следующего события и
    // завершаем обработку текущего события вызовом _jinn.done()
    self._taskQueue.setMinTime(config.defaultInterval);
    self._jinn.done();
  };

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
