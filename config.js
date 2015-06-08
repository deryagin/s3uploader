module.exports.instance = new S3Uploader_Config();

function S3Uploader_Config() {

  var self = this;

  self.classLoader = {
      S3Uploader: s3uploader.ROOT_DIR + 'src/'
  };

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
