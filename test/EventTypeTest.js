var EventType = s3uploader.require('S3Uploader_EventType');
var assert = require('chai').assert;

describe('S3Uploader_EventTypeTest', function () {

  it('isValid() returns TRUE, if EventType was valid', function () {
    assert.isTrue(EventType.isValid(EventType.SERVICE_START));
  });

  it('isValid() returns FALSE, if EventType was not valid', function () {
    assert.isFalse(EventType.isValid('unknown event type'));
  });
});
