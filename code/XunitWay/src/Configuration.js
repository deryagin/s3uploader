module.exports = S3Uploader_XunitWay_Configuration;

function S3Uploader_XunitWay_Configuration() {

  var self = this;

  self.chokidar = {
    path: '/var/spool/mcn/vpbx/records',
    options: {
      alwaysStat: true,
      depth: 0
    }
  };

  self.tasks_queue = {
    defaultInterval: 50, // milliseconds
    maximumInterval: 10000, // milliseconds
    intervalMultiplier: 2
  };

  self.knox = {
    key: 'IJKA0CM19YQRCZZUP1UJ',
    secret: 'MRjqxJcPmKrm6aMPzCn8DErX3bCuY+5DZLjMhGzK',
    bucket: 'test-vpbx',
    endpoint: 'rados.mcn.ru',
    style: 'path'
  }
}
