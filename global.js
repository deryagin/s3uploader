global.s3uploader = {

  ROOT_DIR: __dirname + '/',

  // todo: попробывать реализовать PSR-4
  include: function (qualifiedName) {
    var parts = qualifiedName.split('_');
    var className = parts.pop;
    return require(__dirname + '/' + className);
  }
};
