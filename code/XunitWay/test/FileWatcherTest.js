var FileWatcher = s3uploader.require('S3Uploader_XunitWay_FileWatcher');
var EventService = s3uploader.require('S3Uploader_XunitWay_EventService');
var sinon = require('sinon');
var assert = require('chai').assert;

// todo: заюзать mock-fs. Сделать тест интеграционным.
describe('S3Uploader_XunitWay_FileWatcher', function () {

  /** @type {S3Uploader_XunitWay_FileWatcher} */
  var _fileWatcher = null;

  /** @type {S3Uploader_XunitWay_EventService} */
  var _emitterStub = null;

  var _config = {
    path: '/tmp',
    options: {
      alwaysStat: true,
      depth: 0
    }
  };

  beforeEach(function () {
    _emitterStub = sinon.stub(new EventService());
    _fileWatcher = new FileWatcher(_emitterStub, _config);
  });

  it('startWatching() adds event listener, that call emitEmergedFileEvent() method', function () {
    _fileWatcher.startWatching();
    _fileWatcher._fsWatcher.emit('add', 'localPath', 'fsStats');
    assert.equal(_fileWatcher._fsWatcher.listeners('add')[0], _emitterStub.emitEmergedFileEvent);
    assert.isTrue(_emitterStub.emitEmergedFileEvent.calledWith('localPath', 'fsStats'));
  });

  it('stopWatching() removes event listener, that call emitEmergedFileEvent() method', function () {
    _fileWatcher.startWatching();
    _fileWatcher.stopWatching();
    _fileWatcher._fsWatcher.emit('add', 'localPath', 'fsStats');
    assert.equal(_fileWatcher._fsWatcher.listeners('add').length, 0);
    assert.isTrue(_emitterStub.emitEmergedFileEvent.notCalled);
  });
});
