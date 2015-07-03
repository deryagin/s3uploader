var config = require('./config').instance;
var ClassLoader = require('./src/ClassLoader');

var classLoader = new ClassLoader(config.classLoader);
global.s3uploader.require = classLoader.require;
