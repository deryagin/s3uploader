// todo: добавить тесты

/**
 * Попробывать поиграться с provess.paths и require.resolve()
 * Попробывать убрать node_modules с глаз долой из корня проекта
 * напр. в lib/node_modules.
 */

require('./global');
var config = s3uploader.require('./config');
var Application = s3uploader.require('./src/Application');

var application = new Application(config);
application.start();
