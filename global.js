global.s3uploader = {

  ROOT_DIR: __dirname + '/',

  require: function (relativePath) {
    require(this.ROOT_DIR + relativePath);
  }
};

//global.s3uploader = {};
//
//global.s3uploader.ROOT_DIR = __dirname + '/';
//
//global.s3uploader.require = function (relativePath) {
//  require(__dirname + '/' + relativePath);
//};
