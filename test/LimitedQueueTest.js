var LimitedQueue = s3uploader.require('S3Uploader_LimitedQueue');
var EventService = s3uploader.require('S3Uploader_EventService');
var EventType = s3uploader.require('S3Uploader_EventType');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('S3Uploader_LimitedQueueTest', function () {

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
    var pushTask = sinon.stub();
    _queue._taskQueue.pushTask = pushTask;
    _queue.addFileToQueue('localPath', 'fsStats');
    assert(pushTask.calledWith('file:added', { 'localPath': 'localPath', 'fsStats': 'fsStats' }));
  });

  it('addFileToQueue() followed by firing "EventType.MOVE_NEEDED" after "defaultInterval" time later', function (done) {
    var startTimestamp = Date.now();
    _emitter.on(EventType.MOVE_NEEDED, function checkInterval() {
      assert(_config.defaultInterval <= Date.now() - startTimestamp);
      done();
    });
    _queue.addFileToQueue('localPath', 'fsStats');
  });

  it('speedUpProcessing() resets defaultInterval to the initial value and finish event handling', function () {
    _queue._taskQueue.setMinTime = sinon.stub();
    _queue._jinn = {done: sinon.stub()};
    _queue.speedUpProcessing();
    assert(_queue._taskQueue.setMinTime.calledWith(_config.defaultInterval));
    assert(_queue._jinn.done.called);
  });

  it('slowDownProcessing() increase defaultInterval and push the task into the queue beginning', function () {
    _queue._taskQueue.setMinTime = sinon.stub();
    _queue._taskQueue.pushTask = sinon.stub();
    _queue._jinn = {done: sinon.stub()};
    _queue.slowDownProcessing();
    assert(_queue._taskQueue.setMinTime.calledWith(_config.defaultInterval * _config.intervalMultiplier));
    assert(_queue._jinn.done.called);
    assert(_queue._taskQueue.pushTask.calledWith('file:added'));
  });

  it('slowDownProcessing() not increase defaultInterval more than maximumInterval', function () {
    _queue._taskQueue.setMinTime(_config.maximumInterval);
    _queue._taskQueue.setMinTime = sinon.stub();
    _queue._taskQueue.pushTask = sinon.stub();
    _queue._jinn = {done: sinon.stub()};
    _queue.slowDownProcessing();
    assert(_queue._taskQueue.setMinTime.calledWith(_config.maximumInterval));
  });
});
