/**
 * Вынести логику файла index.js в Application.js.
 * Инициализацию переменных поместить в (function _initialize() {})();
 * Настройку событий поместить в (function _eventness() {})();
 */

/**
 * @todo: S3Client пофиг откуда взялся файл.
 * Поэтому нужно переименовать метод s3Client.onQueueFileAdded во
 * что-то типа s3Client.moveToStore. Тоже относится и к именам других
 * методов. Имена должны отражать не то, что метод стабатывает при
 * возникновении определенногоо события, а то, что этот метод выполняет.
 * Тем более, что какой-то метод может вызываться для нескольких событий.
 */
eventService.on(EventType.QUEUE_FILE_ADDED, s3Client.onQueueFileAdded);

/**
 * Если использовать такой подход, что каждый класс сам подписывается
 * на события, то логика событийной последовательности будет размазана
 * по многим классам. Намного лучше, еали она будет сосредоточена в одном
 * месте. См. object/index.js
 */
//(function _eventness() {
//  _emitter.on(EventType.EVENT_SERVICE_START, onEmitterStart)
//  _emitter.on(EventType.EVENT_SERVICE_STOP, onEmitterStop)
//})();

/**
 * Выполняет только настройку зависимостей. Сами зависимости прописываются
 * как приватные свойства классов. Их инициализация исходным значением
 * производится в момент объявления свойства. Как это делается в Java и
 * нельзя было делать в PHP.
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
 * @todo: имена событий не должны быть привязаны к реализации.
 * Так событие EventType.FSWATCER_FILE_ADDED отражает тот факт,
 * что файл был добавлен в ФС. Хотя файл может появляться не в ФС,
 * а напр. в БД или на FTP итп. Лучше было бы назвать например
 * EventType.EMERGED_FILE.
 */
eventService.on(EventType.EVENT_SERVICE_START, fileWatcher.startWatching);
eventService.on(EventType.FSWATCER_FILE_ADDED, limitedQueue.addFileToQueue);

/**
 * process.cwd() вынести в global.CWD. Хотя, конечно, CWD лучше
 * в глобал не пихать. А то вдруг какая-либо либа его затрет.
 * Чтобы этого не произошло, можно для каждого проекта создавать
 * один объект в global. И все остальные глобальные для данного
 * проекта переменные помещать в этот объект. Аля Module Pattern.
 * Например,
 * global.s3uploader = {};
 * global.s3uploader.ROOT_DIR = __dirname + '/';
 * Если для всех путей использовать префикс s3uploader.ROOT_DIR,
 * то process.chdir() делать не обязательно.
 */

