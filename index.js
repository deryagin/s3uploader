var config = require('./config');
var Application = require('./src/Application');

var application = new Application(config);
application.start();
