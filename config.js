module.exports = {

  chokidar: {
    path: '/var/spool/mcn/vpbx/records',
    options: {
      alwaysStat: true,
      depth: 0
    }
  },

  tasks_queue: {
    defaultInterval: 50, // milliseconds
    maximumInterval: 10000, // milliseconds
    intervalMultiplier: 2
  },

  knox: {
    key: 'IJKA0CM19YQRCZZUP1UJ',
    secret: 'MRjqxJcPmKrm6aMPzCn8DErX3bCuY+5DZLjMhGzK',
    bucket: 'test-vpbx',
    endpoint: 'rados.mcn.ru',
    style: 'path'
  }
};
