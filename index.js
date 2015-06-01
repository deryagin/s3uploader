// todo: добавить тесты

//process.chdir(__dirname);
global.s3uploader = {};
global.s3uploader.ROOT_DIR = __dirname + '/';

/**
 * Попробывать поиграться с provess.paths и require.resolve()
 * Попробывать убрать node_modules с глаз долой из корня проекта
 * напр. в lib/node_modules.
 */
var config = require(s3uploader.ROOT_DIR + 'config');
var Application = require(s3uploader.ROOT_DIR + 'src/Application');

var application = new Application(config);
application.start();
