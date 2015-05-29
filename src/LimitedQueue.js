var EventType = require('EventType');
var TaskQueue = require('tasks-queue');
var config = require('./config');

module.exports = LimitedQueue;

/**
 * @todo: избавиться от multiple definitions
 * @param {config} config
 * @param {events.EventEmitter} emitter
 * @return {LimitedQueue}
 */
function LimitedQueue(config, emitter) {

  var _this = this;

  /** @type {config} */
  var _config = config;

  /** @type {events.EventEmitter} */
  var _emitter = emitter;

  /** @type {tasks-queue.TaskQueue} */
  var _taskQueue = new TaskQueue();

  /**
   * Выполняет только инициализацию зависимостей.
   */
  (function _initialize() {
    //_config = config;
    //_emitter = emitter;
    //_taskQueue = new TaskQueue();
    _taskQueue.setMinTime(50);
    _taskQueue.noautostop();
    _taskQueue.execute();
  })();

  /**
   * Выполняет настройку внутренних событий.
   */
  (function _eventness() {
    _taskQueue.on('file:added', onQueueHandler)
  })();

  /**
   * @param {{localPath: String, fileStats: fs.Stats}} context
   */
  _this.onFsFileAdded = function (context) {
    queue.pushTask('file:added', {
      'localPath': context.localPath,
      'fileStats': context.fileStats
    })
  };

  _this.onS3FileSaved = function () {

  };

  function onQueueHandler(jinn, context) {
    _emitter.emit(EventType.QUEUE_FILE_ADDED, context);
    // todo: jinn нужно гдето запомнить, возможно засунуть его в context
    // и когда это событие будет обработано в S3Store, то сгенерировать
    // новое событие S3STORE_FILE_SAVED и передать context обратно.
    // Соотв. _taskQueue нужно будет подписать на это событие. Тогда _taskQueue
    // используя context сможет вызвать jinn(). Хотя это плохой вариант. Т.к.
    // появляется привязка реализации к jinn.
  }
}
