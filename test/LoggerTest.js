var assert = require('chai').assert;
var StreamFixture = require('fixture-stdout');
var Logger = s3uploader.require('S3Uploader_Logger');

describe('S3Uploader_LoggerTest', function () {

  /** @type {S3Uploader_Logger} */
  var _logger = new Logger();

  /** @type {String} - данные, выводимые в stdout/stderr в тестах */
  var _output = '';

  /** @type {RegExp} - ISO8601 */
  var ISO8601 = /.*\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z.*/;

  beforeEach(function () {
    _output = '';
  });

  it('logSuccess() outputs ISO8601 date, "SUCCESS" substring, and "from", "to" parameters', function () {
    var fixture = new StreamFixture(process.stdout);

    fixture.capture(onWrite);
    _logger.logSuccess('fromURI', 'toURI');
    fixture.release();

    assert.match(_output, ISO8601);
    assert.include(_output, 'SUCCESS');
    assert.include(_output, 'fromURI');
    assert.include(_output, 'toURI');
  });

  it('logError() outputs ISO8601 date, "ERROR" substring, "from", "to" parameters, and the error message', function () {
    var fixture = new StreamFixture(process.stderr);
    var message = 'any error message';
    var error = new Error(message);

    fixture.capture(onWrite);
    _logger.logError(error, 'fromURI', 'toURI');
    fixture.release();

    assert.match(_output, ISO8601);
    assert.include(_output, 'ERROR');
    assert.include(_output, 'fromURI');
    assert.include(_output, 'toURI');
    assert.include(_output, message);
  });

  function onWrite(string) {
    _output += string;
    return false;
  }
});
