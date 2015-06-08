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
 */

При наследовании метод ParentClass.call(this) нужно помещать в
_initialize(), чтобы он не балтался в воздухе:
  (function _initialize() {
    EventEmitter.call(_this);
  })();

/**
 * Упрощение require-ров. https://gist.github.com/branneman/8048520
 * 3 приемлемых способа:
 *    global.s3uploader.ROOT_DIR = __dirname + '/';
 *    global.s3uploader.require = function (name) {__dirname + '/' + name};
 *    npm install app-module-path --save require('app-module-path').addPath(__dirname + '/app');
 *
 * app-module-path вообще-то не очень, т.к. увеличивает число зависимостей проекта.
 * А также либо требует писать длинную строку, либо добавлять функцию в global.s3uploader.
 * Но это более громоздко по сравнению с первыми 2 вариантами!
 *
 * global.s3uploader.require = function кажется самым предпочтительным вариантом.
 * Во-первых от дает самую короткую форму записи. Во-вторых позволяет реализовать
 * более сложную загрузку модулей, при необходимости.
 *
 * Если для всех путей использовать префикс s3uploader.ROOT_DIR, или s3uploader.require()
 * то process.chdir() делать не обязательно.
 */

Наличие файла global.js в корне проекта позволяет собрать все глобальные переменные в одном
месте и оценить их количество. Так же все глобальные переменные проекта помещаются в отдельный
неймспейс s3uploader, чтобы случайно не пересечся с другими переменными.

Т.о. возникает convention, если переменная или функция принадлежит объекту с таким же именем,
как имя проекта (s3uploader), то эта переменная/функция является глобальной для данного проекта.

/**
 * Гипотетически, зависимости можно помещать в this._depName.
 * Тогда их будет легче мокать в тестах. А о том, что зависимость
 * приватная будет говорить символ подчеркивания вначале имени??
 */

/**
 * Но, если логгер немного обобщить и вместо path.basename(localPath) и
 * s3StoreRequest.url использовать context.from и context.to,
 * то логгер становиться полностью независимым от S3Client. Соотв. S3Client
 * (или любой другой на его месте) при выстреливании событий MOVE_SUCCEED и
 * MOVE_FAILING должен добавлять эти параметры в контекст события.
 */

Вместо имен коллбэков типа onFileAdded, или onSuccess, или onError лучше использовать
более информативные имена. Например doSomething.

S3Uploader_EventService выносим из Application в index.js, поскольку это базовая зависимость всех классов.
И очевидно, S3Uploader_EventService должен инстанцироваться на более высоком уровне, чем те объекты, куда
он передается. Как то S3Uploader_FileWatcher, S3Uploader_LimitedQueue, S3Client итп.

У нас есть события, относыщиеся ко всему модулю. Это события, перечисленные в EventType и работа
с ними выполняется через S3Uploader_EventService! Это события верхнего уровня по отношению к
внутренним событиям отдельного взятого класса типа S3Uploader_FileWatcher или S3Uploader_LimitedQueue. Поэтому, есть
смысл ввести конвенцию на именование методов, которые генерирую события верхнего уровня.
Напр. можно еменовать их по схеме raise<EventName>Event. См. например S3Uploader_FileWatcher.raiseEmergedFileEvent()
или S3Uploader_LimitedQueue.raiseProcessFileEvent().

S3Client переименован в S3Uploader_S3Courier. Поскольку он не просто посылает файл в S3, а именно перемещает его.
Т.е. содержит в себе логику чтения локального файла и удаления его после копирования в S3.

В S3Uploader_EventService добавлены методы emit<EventType>Event. Через которые должны эмититься конкретные
 события. Список параметров этих методов определяю контекст события. При этом наследование
 S3Uploader_EventService от EventEmitter было заменено на делегирование к его методам on и emit. Это сделано для того, чтобы
 события нельзя было эмитить напрямую, а только через методы emit<EventType>Event. Это защищает от появления
 в системе недокументированных событий. Поэтому событие обязательно должно быть зарегистрировано в EventType.
 И для него должен быть созда метод S3Uploader_EventService.emit<EventType>Event.

Уточнение в конвенции именования. В S3Uploader_EventService используется префикс emit, в остальных классах -- префикс raise.
Например: S3Uploader_LimitedQueue.raiseProcessFileEvent(), S3Uploader_EventService.emitMoveNeededEvent().

S3Uploader_EventType является статическим классом, который хранит перечень констант. Что бы быть трушными
 константами, эти константы должны позволять доступ через идентификатор функции, но не позволять доступ
 через экземпляр объекта функции-конструетора. Чтобы добиться этого, мы объявляем константы, как члены
 функции конструктора: `S3Uploader_EventType.SERVICE_START = 'SERVICE_START';`. Но делаем это не снаружи,
 а изнутри функции конструктора, чтобы функция оставалась self-contained:
```js
   function S3Uploader_EventType() {

     S3Uploader_EventType.SERVICE_START = 'SERVICE_START';

     S3Uploader_EventType.SERVICE_STOP = 'SERVICE_STOP';

     S3Uploader_EventType.EMERGED_FILE = 'EMERGED_FILE';

     S3Uploader_EventType.MOVE_NEEDED = 'MOVE_NEEDED';

     S3Uploader_EventType.MOVE_SUCCEED = 'MOVE_SUCCEED';

     S3Uploader_EventType.MOVE_FAILING = 'MOVE_FAILING';
   }
```

// S3Uploader_Config, по-сути дела, -- это реализация шаблона Singleton;
// instance подчеркивает, что экспортируется экземпляр объекта,
// а не сама функция-конструктор

Ко всем методам, являющимся обработчиками какого-либо события из S3Uploader_EventType
в JSDoc комментарии добавлен тэг @see S3Uploader_EventService.emit<EventType>Event.
Этот тэг указывает на класс/метод, котоый является эмиттером для данного события.
Соответственно у метода-обработчика события сигнарута должна быть идентичной сигнатуре
метода-эмиттера этого события. Поэтому и используется тэг @see.

Вкратце, чем S3Uploader_ClassLoader лучше обычного require:
  1) Позволяет избавится от ../../.. или от s3uploader.ROOT_DIR + 'src/EventService'
  2) Позволяет улучшить autocomplete.
  3) Позволяет улучшить find definition.
  4) Позволяет улучшить find usages.
  5) Позволяет улучшить name nesting.
Хотя вариант require(s3uploader.ROOT_DIR + 'src/EventService'); остается все еще привлекаательным.
