process.chdir(__dirname);

require('./global');
var config = require(s3uploader.ROOT_DIR + 'config');
var Application = require(s3uploader.ROOT_DIR + 'src/Application');

var application = new Application(config);
application.start();
