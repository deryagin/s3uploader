module.exports = S3Uploader_XunitWay_EventType;

function S3Uploader_XunitWay_EventType() {}

S3Uploader_XunitWay_EventType.SERVICE_START = 'SERVICE_START';

S3Uploader_XunitWay_EventType.SERVICE_STOP = 'SERVICE_STOP';

S3Uploader_XunitWay_EventType.EMERGED_FILE = 'EMERGED_FILE';

S3Uploader_XunitWay_EventType.MOVE_NEEDED = 'MOVE_NEEDED';

S3Uploader_XunitWay_EventType.MOVE_SUCCEED = 'MOVE_SUCCEED';

S3Uploader_XunitWay_EventType.MOVE_FAILING = 'MOVE_FAILING';

S3Uploader_XunitWay_EventType.isValid = function isValid(eventType) {
  return S3Uploader_XunitWay_EventType.hasOwnProperty(eventType);
};
