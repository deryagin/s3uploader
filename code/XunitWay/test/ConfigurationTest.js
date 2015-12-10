var Configuration = s3uploader.require('S3Uploader_XunitWay_Configuration');
var assert = require('chai').assert;

describe('S3Uploader_XunitWay_Configuration', function () {

  /** @type {S3Uploader_XunitWay_Configuration} */
  var _config = null;

  beforeEach(function () {
    _config  = new Configuration();
  });

  it('Instance S3Uploader_XunitWay_Configuration has valid chokidar configuration', function () {
    assert.propertyVal(_config.chokidar, 'path', '/var/spool/mcn/vpbx/records');
    assert.property(_config.chokidar.options, 'alwaysStat');
    assert.property(_config.chokidar.options, 'depth');
  });

  it('Instance S3Uploader_XunitWay_Configuration has valid tasks_queue configuration', function () {
    assert.property(_config.tasks_queue, 'defaultInterval');
    assert.property(_config.tasks_queue, 'maximumInterval');
    assert.property(_config.tasks_queue, 'intervalMultiplier');
  });

  it('Instance S3Uploader_XunitWay_Configuration has valid knox configuration', function () {
    assert.property(_config.knox, 'key');
    assert.property(_config.knox, 'secret');
    assert.property(_config.knox, 'bucket');
    assert.propertyVal(_config.knox, 'style', 'path');
  });
});
