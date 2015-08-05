var EventType = require(s3uploader.ROOTDIR + 'src/EventType');
var EventService = require(s3uploader.ROOTDIR + 'src/EventService');
var FileWatcher = require(s3uploader.ROOTDIR + 'src/FileWatcher');
var LimitedQueue = require(s3uploader.ROOTDIR + 'src/LimitedQueue');
var S3Sender = require(s3uploader.ROOTDIR + 'src/S3Sender');
var Logger = require(s3uploader.ROOTDIR + 'src/Logger');

var TestHarness = require(s3uploader.ROOTDIR + 'src/TestHarness');
var mockery = require('mockery');
var sinon = require('sinon');
var assert = require('chai').assert;

describe('S3Uploader_Application', function () {

  /** @constructor {S3Uploader_Application} */
  var _Application = null;

  /** @type {S3Uploader_Application} */
  var _application = null;

  /** @type {S3Uploader_EventService} */
  var _emitter = null;

  /** @type {Object} */
  var _config = null;

  /** @type {S3Uploader_TestHarness} */
  var _testHarness = new TestHarness();

  before(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    FileWatcher._initialize = sinon.stub();
    LimitedQueue._initialize = sinon.stub();
    S3Sender._initialize = sinon.stub();
    Logger._initialize = sinon.stub();

    mockery.registerMock(s3uploader.ROOTDIR + 'src/FileWatcher', FileWatcher);
    mockery.registerMock(s3uploader.ROOTDIR + 'src/LimitedQueue', LimitedQueue);
    mockery.registerMock(s3uploader.ROOTDIR + 'src/S3Sender', S3Sender);
    mockery.registerMock(s3uploader.ROOTDIR + 'src/Logger', Logger);

    _Application = require(s3uploader.ROOTDIR + 'src/Application');
  });

  beforeEach(function () {
    _config = {};
    _emitter = new EventService();
    _application = new _Application(_emitter, _config);
  });

  afterEach(function () {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('_initialize() setted up appropriate events', function () {
    //console.log(_emitter.listeners(EventType.SERVICE_START)[0].name);process.exit();
    //console.log(_emitter.listeners('asdf'));process.exit();
    //assert.include(_emitter.listeners(EventType.SERVICE_START), _application._fileWatcher.startWatching);
    assert(0 < _emitter._emitter.listeners(EventType.SERVICE_START).length);
    assert(0 < _emitter._emitter.listeners(EventType.EMERGED_FILE).length);
    assert(0 < _emitter._emitter.listeners(EventType.MOVE_NEEDED).length);
    assert(0 < _emitter._emitter.listeners(EventType.MOVE_SUCCEED).length);
    assert(0 < _emitter._emitter.listeners(EventType.MOVE_FAILING).length);
    assert(0 < _emitter._emitter.listeners(EventType.SERVICE_STOP).length);
  });

  it('start() emits {EventType.SERVICE_START} event', function (done) {
    //_emitter.emitServiceStartEvent = sinon.stub();
    //_application._emitter = new EventService();
    //assert(_emitter.emitServiceStartEvent.called);
    _emitter._emitter.removeAllListeners(EventType.SERVICE_START);
    _testHarness.setExpectedEvent(_emitter, EventType.SERVICE_START, 100, done);
    _application.start();
  });
});
