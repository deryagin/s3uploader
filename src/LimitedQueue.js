var TaskQueue = require('tasks-queue');
var EventType = require(s3uploader.ROOT_DIR + 'EventType');

module.exports = S3Uploader_LimitedQueue;

/**
 * @param {config.tasks_queue} config
 * @param {S3Uploader_EventService} emitter
 */
function S3Uploader_LimitedQueue(config, emitter) {

  var self = this;

  /** @type {tasks-queue.TaskQueue} */
  var _taskQueue = new TaskQueue();

  /** @type {Jinn} - вызов jinn.done() указывает на завершение обработки очередного события https://github.com/tutukin/tasks-queue */
  var _jinn = null;

  var FILE_ADDED_EVENT = 'file:added';

  (function _initialize() {
    _taskQueue.setMinTime(config.defaultInterval);
    _taskQueue.noautostop();
    _taskQueue.execute();
  })();

  (function _eventness() {
    _taskQueue.on(FILE_ADDED_EVENT, raiseProcessFileEvent)
  })();

  /**
   * @param {{localPath: String, fileStats: fs.Stats}} context
   */
  self.addFileToQueue = function (context) {
    queue.pushTask(FILE_ADDED_EVENT, {
      'localPath': context.localPath,
      'fileStats': context.fileStats
    })
  };

  self.continueProcessing = function () {
    // если все ок, то сбрасываем интервал ожидания обработки
    // следующего события и завершает его обработку вызовом _jinn.done()
    _taskQueue.setMinTime(config.defaultInterval);
    _jinn.done();
    _jinn = null;
  };

  self.slowDownProcessing = function () {
    // если ошибка, добавляем таск в конец очереди,
    // чтобы снова попытаться отправить файл в S3
    // и увеличиваем интервал между попытками
    slowDownTaskQueue();
    _taskQueue.pushTask('file:added', fileInfo); // todo: fileInfo нужно запоминать, чтобы потом здесь использовать!
    _jinn.done();
    _jinn = null;
  };

  function raiseProcessFileEvent(jinn, context) {
    emitter.emitProcessFileEvent(context.localPath, context.fileStats);
    _jinn = jinn;
  }

  function slowDownTaskQueue() {
    var retryInterval = config.intervalMultiplier * _taskQueue.getMinTime();
    var isOverInterval = config.maximumInterval < retryInterval;
    retryInterval = (isOverInterval ? config.maximumInterval : retryInterval);
    _taskQueue.setMinTime(retryInterval);
  }
}
