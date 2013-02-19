/**
 * Express SignUp Spec
 *
 * @todo write process helpers
 * @todo remove tests that should be in the model
 */

/**
 * Module dependencies.
 */

var App = require('../example/app'),
    fs = require('fs'),
    https = require('https'),
    config = require('../example/config'),
    Mailbox = require('test-mailbox'),
    request = require('superagent'),
    should = require('should');

/**
 * Tests
 */

describe('Password Reset', function () {

  var app,
      baseURL,
      server,
      urls = {},
      mailbox;

  before(function (done) {

    app = App(config);

    app.on('ready', function () {
      if (!app.address) {
        server = server = https.createServer({
          key: fs.readFileSync(__dirname + '/../example/ssl/key.pem'),
          cert: fs.readFileSync(__dirname + '/../example/ssl/cert.pem')
        }, app);
        server.listen(config.httpsPort);
        baseURL = 'https://localhost:' + config.httpsPort;
      } else {
        baseURL = 'https://localhost:' + app.address().port;
      };

      urls.new = baseURL + '/password-reset';

      done();

    });
  });

  after(function (done) {
    //close mailbox and app
    server.close(function() {
      done();
    });
  })

  describe('GET /password-reset', function () {

    it('should render the password reset page', function (done) {
      request
        .get(urls.new)
        .redirects(0)
        .end(function (err, res) {
          res.statusCode.should.equal(200);
          res.text.should.include('<title>Password Reset</title>');
          // should have a form with email, password and passwordConfirm field
          done();
        });
    });

  });

});