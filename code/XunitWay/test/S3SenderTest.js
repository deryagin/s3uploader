var S3Sender = s3uploader.require('S3Uploader_XunitWay_S3Sender');
var EventService = s3uploader.require('S3Uploader_XunitWay_EventService');
var EventType = s3uploader.require('S3Uploader_XunitWay_EventType');
var TestHarness = s3uploader.require('S3Uploader_XunitWay_TestHarness');

var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var rmdir = require('rimraf');
var S3rver = require('s3rver');
var assert = require('chai').assert;

describe('S3Uploader_XunitWay_S3Sender', function () {

  /** @type {S3Uploader_XunitWay_TestHarness} */
  var _harness = new TestHarness();

  /** @type {S3rver} */
  var _s3server = new S3rver();

  /** @type {S3Uploader_XunitWay_Configuration.knox} */
  var _config = {
    key: 'IJKA0CM19YQRCZZUP1UJ',
    secret: 'MRjqxJcPmKrm6aMPzCn8DErX3bCuY+5DZLjMhGzK',
    bucket: 'precreated_bucket',
    endpoint: 'localhost',
    style: 'path',
    port: 10001
  };

  before(function (done) {
    mkdirp.sync('/tmp/s3server/' + _config.bucket);
    _s3server.setHostname('localhost')
      .setPort(10001)
      .setDirectory('/tmp/s3server')
      .setSilent(true)
      .run(function (err, host, port) {
        return done(err);
      });
  });

  beforeEach(function () {
    fs.writeFileSync('/tmp/3_430824840.466840.mp3', 'any content');
  });

  afterEach(function () {
    if (fs.existsSync('/tmp/3_430824840.466840.mp3')) {
      fs.unlinkSync('/tmp/3_430824840.466840.mp3');
    }
  });

  after(function () {
    // todo: разобраться как выключить _s3server
    rmdir.sync('/tmp/s3server/');
  });

  it('moveToStore() emits EventType.MOVE_SUCCEED when success', function (done) {
    var emitter = new EventService();
    var s3sender = new S3Sender(emitter, _config);
    var localPath = '/tmp/3_430824840.466840.mp3';
    var fsStats = fs.statSync(localPath);
    _harness.setExpectedEvent(emitter, EventType.MOVE_SUCCEED, 100, done);
    s3sender.moveToStore(localPath, fsStats);
  });

  it('moveToStore() emits EventType.MOVE_FAILING when fail', function (done) {
    _config.bucket = 'unknown';
    var emitter = new EventService();
    var s3sender = new S3Sender(emitter, _config);
    var localPath = '/tmp/3_430824840.466840.mp3';
    var fsStats = fs.statSync(localPath);
    _harness.setExpectedEvent(emitter, EventType.MOVE_FAILING, 100, done);
    s3sender.moveToStore(localPath, fsStats);
  });

  xit('moveToStore() removes the source file when success', function () {

  });

  xit('moveToStore() does not remove the source file when fail', function () {

  });

  it('buildS3SrotePath() returns /vpbx/{vpbxId}/records/{fileName} formed string', function () {
    var emitter = new EventService();
    var s3sender = new S3Sender(emitter, _config);
    var s3FilePath = s3sender.buildS3SrotePath('/tmp/3_430824840.466840.mp3');
    assert.equal(s3FilePath, '/vpbx/3/records/430824840.466840.mp3')
  });
});
