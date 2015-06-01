// todo: добавить тесты

//process.chdir(__dirname);
global.s3uploader = {};
global.s3uploader.ROOT_DIR = __dirname + '/';
global.s3uploader.require = function (modulePath) {
  require(__dirname + '/' + modulePath);
};

/**
 * Упрощение require-ров. https://gist.github.com/branneman/8048520
 * 3 приемлемых способа:
 *    global.s3uploader.ROOT_DIR = __dirname + '/';
 *    global.s3uploader.require = function (name) {__dirname + '/' + name};
 *    npm install app-module-path --save require('app-module-path').addPath(__dirname + '/app');
 *
 * app-module-path вообще-то не очень, т.к. увеличивает число зависимостей проекта.
 * А также либо требует писать длинную строку, либо добавлять функцию в global.s3uploader.
 * Но это более громоздко по сравнению с первыми 2 вариантами!
 *
 * global.s3uploader.require = function кажется самым предпочтительным вариантом.
 * Во-первых от дает самую короткую форму записи. Во-вторых позволяет реализовать
 * более сложную загрузку модулей, при необходимости.
 */

/**
 * Попробывать поиграться с provess.paths и require.resolve()
 * Попробывать убрать node_modules с глаз долой из корня проекта
 * напр. в lib/node_modules.
 */
var config = require(s3uploader.ROOT_DIR + 'config');
var Application = require(s3uploader.ROOT_DIR + 'src/Application');

require('./global');
var config2 = s3uploader.require('config');
var Application2 = s3uploader.require('src/Application');

var application = new Application(config);
application.start();
