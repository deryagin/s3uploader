process.chdir(__dirname);
global.CWD = process.cwd() + '/';

/**
 * process.cwd() вынести в global.CWD. Хотя, конечно, CWD лучше
 * в глобал не пихать. А то вдруг какая-либо либа его затрет.
 * Попробывать поиграться с provess.paths и require.resolve()
 * Попробывать убрать node_modules с глаз долой из корня проекта
 * напр. в lib/node_modules.
 */
var config = require(CWD + 'config');
var Application = require(CWD + 'src/Application');

var application = new Application(config);
application.start();
