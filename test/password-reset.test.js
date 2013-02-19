/**
 * Express Password Reset Unit Tests
 */

/**
 * Module dependencies.
 */

var should = require('should'),
    PasswordReset = require('../index');

/**
 * Tests
 */

describe('Password Reset', function () {

  describe('.version', function () {

    it('should match the format x.x.x', function (done) {
      PasswordReset.version.should.match(/^\d+\.\d+\.\d+$/);
      done();
    });

  });

});