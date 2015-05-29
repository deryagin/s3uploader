process.chdir(__dirname);
global.CWD = process.cwd() + '/';

/**
 * process.cwd() вынести в global.CWD.
 * Попробывать поиграться с provess.paths и require.resolve()
 * Попробывать убрать node_modules с глаз долой из корня проекта
 * напр. в lib/node_modules.
 */
var config = require(process.cwd() + '/config');
var Application = require(process.cwd() + '/src/Application');

var application = new Application(config);
application.start();
