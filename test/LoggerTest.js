var Logger = s3uploader.require('S3Uploader_Logger');
var StreamFixture = require('fixture-stdout');
var assert = require('chai').assert;

describe('S3Uploader_Logger', function () {

  /** @type {S3Uploader_Logger} */
  var _logger = null;

  /** @type {String} - данные, выводимые в stdout/stderr в тестах */
  var _output = '';

  /** @type {RegExp} - ISO8601 */
  var ISO8601 = /.*\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z.*/;

  beforeEach(function () {
    _logger = new Logger();
    _output = '';
  });

  it('logStart() outputs ISO8601 date, "START" substring', function () {
    var fixture = new StreamFixture(process.stdout);

    fixture.capture(saveOutput);
    _logger.logStart();
    fixture.release();

    assert.match(_output, ISO8601);
    assert.include(_output, 'START');
  });

  it('logStop() outputs ISO8601 date, "STOP" substring', function () {
    var fixture = new StreamFixture(process.stdout);

    fixture.capture(saveOutput);
    _logger.logStop();
    fixture.release();

    assert.match(_output, ISO8601);
    assert.include(_output, 'STOP');
  });

  it('logSuccess() outputs ISO8601 date, "SUCCESS" substring, and "from", "to" parameters', function () {
    var fixture = new StreamFixture(process.stdout);

    fixture.capture(saveOutput);
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

    fixture.capture(saveOutput);
    _logger.logError(error, 'fromURI', 'toURI');
    fixture.release();

    assert.match(_output, ISO8601);
    assert.include(_output, 'ERROR');
    assert.include(_output, 'fromURI');
    assert.include(_output, 'toURI');
    assert.include(_output, message);
  });

  function saveOutput(string) {
    _output += string;
    return false;
  }
});
