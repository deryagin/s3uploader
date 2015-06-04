module.exports = new S3Uploader_EventType();

/**
 * @todo: возможно события лучше засунуть в прототип.
 * Тогда можно будет экспортировать не объект, а класс.
 */
function S3Uploader_EventType() {

  var self = this;

  self.SERVICE_START = 'SERVICE_START';

  self.SERVICE_STOP = 'SERVICE_STOP';

  self.EMERGED_FILE = 'EMERGED_FILE';

  self.PROCESS_FILE = 'PROCESS_FILE';

  self.MOVE_SUCCEED = 'MOVE_SUCCEED';

  self.MOVE_FAILING = 'MOVE_FAILING';
}
