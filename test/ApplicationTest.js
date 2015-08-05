//var Application = s3uploader.require('S3Uploader_Application');
//var FileWatcher = s3uploader.require('S3Uploader_FileWatcher');
//var LimitedQueue = s3uploader.require('S3Uploader_LimitedQueue');
//var S3Sender = s3uploader.require('S3Uploader_S3Sender');
//var Logger = s3uploader.require('S3Uploader_Logger');

var EventType = require(s3uploader.ROOTDIR + 'src/EventType');
var FileWatcher = require(s3uploader.ROOTDIR + 'src/FileWatcher');
var LimitedQueue = require(s3uploader.ROOTDIR + 'src/LimitedQueue');
var S3Sender = require(s3uploader.ROOTDIR + 'src/S3Sender');
var Logger = require(s3uploader.ROOTDIR + 'src/Logger');

var EventEmitter = require('events').EventEmitter;
var mockery = require('mockery');
var sinon = require('sinon');
var assert = require('chai').assert;

describe('S3Uploader_Application', function () {

  /** @type {S3Uploader_Application} */
  var _application = null;

  /** @type {EventEmitter} */
  var _emitter = null;

  /** @type {Object} */
  var _config = null;

  beforeEach(function () {
    FileWatcher._initialize = sinon.stub();
    LimitedQueue._initialize = sinon.stub();
    S3Sender._initialize = sinon.stub();
    Logger._initialize = sinon.stub();


    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock(s3uploader.ROOTDIR + 'src/FileWatcher', FileWatcher);
    mockery.registerMock(s3uploader.ROOTDIR + 'src/LimitedQueue', LimitedQueue);
    mockery.registerMock(s3uploader.ROOTDIR + 'src/S3Sender', S3Sender);
    mockery.registerMock(s3uploader.ROOTDIR + 'src/Logger', Logger);


    var Application = require(s3uploader.ROOTDIR + 'src/Application');
    _config = {};
    _emitter = new EventEmitter();
    _application = new Application(_emitter, _config);
  });

  afterEach(function () {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('_initialize() setted up appropriate events', function () {
    //console.log(_emitter.listeners(EventType.SERVICE_START)[0].name);process.exit();
    //console.log(_emitter.listeners('asdf'));process.exit();
    //assert.include(_emitter.listeners(EventType.SERVICE_START), _application._fileWatcher.startWatching);
    assert(0 < _emitter.listeners(EventType.SERVICE_START).length);
    assert(0 < _emitter.listeners(EventType.EMERGED_FILE).length);
    assert(0 < _emitter.listeners(EventType.MOVE_NEEDED).length);
    assert(0 < _emitter.listeners(EventType.MOVE_SUCCEED).length);
    assert(0 < _emitter.listeners(EventType.MOVE_FAILING).length);
    assert(0 < _emitter.listeners(EventType.SERVICE_STOP).length);
  });

  it('start() emits {EventType.SERVICE_START} event', function () {
    // todo: возможно лучше использовать EventService и ловить само событие EventType.SERVICE_START
    _emitter.emitServiceStartEvent = sinon.stub();
    _application.start();
    assert(_emitter.emitServiceStartEvent.called);
  });
});
