var LimitedQueue = s3uploader.require('S3Uploader_LimitedQueue');
var EventService = s3uploader.require('S3Uploader_EventService');
var EventType = s3uploader.require('S3Uploader_EventType');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('S3Uploader_LimitedQueue', function () {

  /** @type {S3Uploader_LimitedQueue} */
  var _queue = null;

  /** @type {S3Uploader_EventService} */
  var _emitter = null;

  /** @type {Object} */
  var _config = null;

  beforeEach(function () {
    _config = {
      defaultInterval: 50,
      maximumInterval: 10000,
      intervalMultiplier: 2
    };
    _emitter = new EventService();
    _queue = new LimitedQueue(_emitter, _config);
  });

  it('addFileToQueue() added new event with "localPath" and "fsStats" parameters', function () {
    _queue.addFileToQueue('localPath', 'fsStats');
    var task = _queue._taskQueue.getTask(0);
    assert.equal(_queue._taskQueue.length(), 1);
    assert.equal('file:added', task._type);
    assert.equal('localPath', task._data.localPath);
    assert.equal('fsStats', task._data.fsStats);
  });

  it('addFileToQueue() followed by firing "EventType.MOVE_NEEDED" after "defaultInterval" time later', function () {
    var startTimestamp = Date.now();
    _emitter.on(EventType.MOVE_NEEDED, function checkInterval() {
      assert.isTrue(_config.defaultInterval < Date.now() - startTimestamp);
      _queue.speedUpProcessing();
      done();
    });
    _queue.addFileToQueue('localPath', 'fsStats');
  });

  it('speedUpProcessing() resets defaultInterval to the initial value and finish event handling', function () {
    _queue._taskQueue.setMinTime = sinon.spy();
    _queue._jinn = {done: sinon.spy()};
    _queue.speedUpProcessing();
    assert(_queue._taskQueue.setMinTime.calledWith(_config.defaultInterval));
    assert(_queue._jinn.done.called);
  });

  it('slowDownProcessing() insrease defaultInterval and finish event handling', function () {
    _queue._taskQueue.setMinTime = sinon.spy();
    _queue._jinn = {done: sinon.spy()};
    _queue.slowDownProcessing();
    assert(_queue._taskQueue.setMinTime.calledWith(_config.defaultInterval * _config.intervalMultiplier));
    assert(_queue._jinn.done.called);
  });
});
