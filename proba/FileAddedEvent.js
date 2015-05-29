module.exports = FileAddedEvent;

/**
 * @param {String} filePath
 * @param {fs.Stats} fileStats
 */
function FileAddedEvent(filePath, fileStats) {

  var _this = this;

  _this.type = 'fswatcher:file:added';

  _this.filePath = '';

  _this.fileStats = null;

  (function _initialize() {
    _this.filePath = filePath;
    _this.fileStats = fileStats;
  })();
}

var event = new FileAddedEvent(null, null);
console.log(FileAddedEvent.name);
console.log(event.type);
