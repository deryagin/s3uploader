"use strict";

var FSWatcher = require('chokidar').FSWatcher;

module.exports = S3Uploader_ES6Way_FileWatcher;

class S3Uploader_ES6Way_FileWatcher {

  ///** @type {FSWatcher} */
  //fsWatcher = new FSWatcher(config.options);

  /**
   * @param {S3Uploader_EventService} emitter
   * @param {S3Uploader_Configuration.chokidar} config
   */
  constructor(emitter, config) {
    this.emitter = emitter;
    this.config = config;
    this.fsWatcher = new FSWatcher(config.options);
  }

  /**
   * @see {S3Uploader_EventService.emitServiceStartEvent}
   * @listens {S3Uploader_EventType.SERVICE_START}
   */
  startWatching() {
    this.fsWatcher.add(config.path);
    this.fsWatcher.on('add', this.emitter.emitEmergedFileEvent);
  };

  /**
   * @see {S3Uploader_EventService.emitServiceStopEvent}
   * @listens {S3Uploader_EventType.SERVICE_STOP}
   */
  stopWatching() {
    this.fsWatcher.unwatch(config.path);
    this.fsWatcher.removeListener('add', this.emitter.emitEmergedFileEvent);
  };
}
