var assert = require('chai').assert;
var EventService = s3uploader.require('S3Uploader_EventService');
var EventType = s3uploader.require('S3Uploader_EventType');

describe('S3Uploader_EventService', function () {

  /** @type {S3Uploader_EventService} */
  var _emitter = null;

  beforeEach(function () {
    _emitter = new EventService();
  });

  it('on() registers event listener and returns self', function () {
    var listener = new Function();
    var returned = _emitter.on('any event name', listener);
    var listenerSet = _emitter._emitter.listeners('any event name');

    assert.lengthOf(listenerSet, 1);
    assert.deepEqual(listenerSet.pop(), listener);
    assert.deepEqual(returned, _emitter);
  });

  it('emitServiceStartEvent() emits {EventType.SERVICE_START} event', function (done) {
    _emitter.on(EventType.SERVICE_START, function () {
      done();
    });
    _emitter.emitServiceStartEvent();
  });

  it('emitServiceStopEvent() emits {EventType.SERVICE_STOP} event', function (done) {
    _emitter.on(EventType.SERVICE_STOP, function () {
      done();
    });
    _emitter.emitServiceStopEvent();
  });

  it('emitEmergedFileEvent() emits {EventType.EMERGED_FILE} event', function (done) {
    _emitter.on(EventType.EMERGED_FILE, function (localPath, fsStats) {
      assert.equal('localPath', localPath);
      assert.equal('fs.Stats', fsStats);
      done();
    });
    _emitter.emitEmergedFileEvent('localPath', 'fs.Stats');
  });

  it('emitMoveNeededEvent() emits {EventType.MOVE_NEEDED} event', function (done) {
    _emitter.on(EventType.MOVE_NEEDED, function (localPath, fsStats) {
      assert.equal('localPath', localPath);
      assert.equal('fs.Stats', fsStats);
      done();
    });
    _emitter.emitMoveNeededEvent('localPath', 'fs.Stats');
  });

  it('emitMoveSucceedEvent() emits {EventType.MOVE_SUCCEED} event', function (done) {
    _emitter.on(EventType.MOVE_SUCCEED, function (from, to) {
      assert.equal('from', from);
      assert.equal('to', to);
      done();
    });
    _emitter.emitMoveSucceedEvent('from', 'to');
  });

  it('emitMoveFailingEvent() emits {EventType.MOVE_FAILING} event', function (done) {
    var expError = new Error('any error message');
    _emitter.on(EventType.MOVE_FAILING, function (error, from, to) {
      assert.equal(error, expError);
      assert.equal('from', from);
      assert.equal('to', to);
      done();
    });
    _emitter.emitMoveFailingEvent(expError, 'from', 'to');
  });
});
