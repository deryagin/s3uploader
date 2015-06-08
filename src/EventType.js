module.exports = S3Uploader_EventType;

function S3Uploader_EventType() {

  S3Uploader_EventType.SERVICE_START = 'SERVICE_START';

  S3Uploader_EventType.SERVICE_STOP = 'SERVICE_STOP';

  S3Uploader_EventType.EMERGED_FILE = 'EMERGED_FILE';

  S3Uploader_EventType.MOVE_NEEDED = 'MOVE_NEEDED';

  S3Uploader_EventType.MOVE_SUCCEED = 'MOVE_SUCCEED';

  S3Uploader_EventType.MOVE_FAILING = 'MOVE_FAILING';
}
