var TaskQueue = require('tasks-queue');
var EventType = require(s3uploader.ROOT_DIR + 'EventType');

module.exports = LimitedQueue;

/**
 * @todo: избавиться от multiple definitions для config. Придумать форму по короче.
 * @param {{defaultInterval: Number, maximumInterval: Number, intervalMultiplier: Number}} config
 * @param {Number} config.defaultInterval
 * @param {events.EventEmitter} emitter
 */
function LimitedQueue(config, emitter) {

  var _this = this;

  /** @type {tasks-queue.TaskQueue} */
  var _taskQueue = new TaskQueue();

  /** @type {Jinn} - вызов jinn.done() указывает на завершение обработки очередного события */
  var _jinn = null;

  var FILE_ADDED_EVENT = 'file:added';

  (function _initialize() {
    _taskQueue.setMinTime(config.defaultInterval);
    _taskQueue.noautostop();
    _taskQueue.execute();
  })();

  (function _eventness() {
    _taskQueue.on(FILE_ADDED_EVENT, fireProcessFileEvent)
  })();

  /**
   * @param {{localPath: String, fileStats: fs.Stats}} context
   */
  _this.addFileToQueue = function (context) {
    queue.pushTask(FILE_ADDED_EVENT, {
      'localPath': context.localPath,
      'fileStats': context.fileStats
    })
  };

  _this.continueProcessing = function () {

    // todo: Этих двух строк тут быть не должно. Логирование вообще должно быть отдельно!
    fs.unlink(localPath);
    console.log('%s SUCCESS: %s -> %s', new Date().toISOString(), path.basename(localPath), s3StoreRequest.url);

    // если все ок, то сбрасываем интервал ожидания обработки
    // следующего события и завершает его обработку вызовом _jinn.done()
    _taskQueue.setMinTime(config.defaultInterval);
    _jinn.done();
    _jinn = null;
  };

  _this.slowDownProcessing = function () {
    // если ошибка, добавляем таск в конец очереди,
    // чтобы снова попытаться отправить файл в S3
    // и увеличиваем интервал между попытками
    var retryInterval = calcRetryInterval;
    _taskQueue.pushTask('file:added', fileInfo);
    _taskQueue.setMinTime(retryInterval);
    _jinn.done();
    _jinn = null;

    // todo: Логирования тут быть не должно! Для этого есть события.
    console.error('%s ERROR: %s -> %s', new Date().toISOString(), path.basename(localPath), s3StoreRequest.url, errorMessage);
  };

  function fireProcessFileEvent(jinn, context) {
    emitter.emit(EventType.PROCESS_FILE, context);
    _jinn = jinn;
  }

  function calcRetryInterval() {
    var retryInterval = config.intervalMultiplier * _taskQueue.getMinTime();
    var isOverInterval = config.maximumInterval < retryInterval;
    return (isOverInterval ? config.maximumInterval : retryInterval);
  }
}
