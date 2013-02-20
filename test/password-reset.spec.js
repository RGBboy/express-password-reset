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
    mongoose = require('mongoose'),
    Mailbox = require('test-mailbox'),
    request = require('superagent'),
    should = require('should');

/**
 * Tests
 */

describe('Password Reset', function () {

  var app,
      UserModel,
      fakeUser = {
        email: 'test@test.com',
        password: 'testPassword'
      },
      user,
      baseURL,
      server,
      urls = {},
      mailbox;

  before(function (done) {

    app = App(config);

    app.on('ready', function () {
      UserModel = mongoose.model('User');
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
      urls.create = urls.new;
      urls.edit = urls.new + '/edit';

      var newUser;

      UserModel.remove(function (err) {
        if (err) { throw err };
        newUser = new UserModel({
          email: fakeUser.email,
          password: fakeUser.password,
          passwordConfirm: fakeUser.password
        });
        newUser.save(function (err, user) {
          user = user;
          done();
        });
      });

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
      request.agent()
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

  describe('POST /password-reset', function () {

    describe('when correct credentials are POSTed', function () {

      var mailbox;

      before(function (done) {
        mailbox = new Mailbox({
          address: fakeUser.email,
          auth: config.mailer.auth
        });
        mailbox.listen(config.mailer.port, done);
      });

      after(function (done) {
        mailbox.close(done);
      });

      it('should instruct the user to check their email', function (done) {
        request.agent()
          .post(urls.create)
          .send({ 
            user: {
              email: fakeUser.email
            },
          })
          .end(function (err, res) {
            res.text.should.include('Please check your email for instructions on resetting your password.');
            done();
          });
      });

      it('should send an email to the user with an resetToken url', function (done) {
        mailbox.once('newMail', function (mail) {
          mail.should.exist;
          var resetTokenAnchorRE = /<a(:?.*?)class="(:?resetToken|(:?.*?) resetToken)(:?.*?)"(:?.*?)>(:?.*?)<\/a>/gi;
          var resetTokenAnchor = mail.html.match(resetTokenAnchorRE)[0];
          var resetTokenURLRE = /href="(.*?)"/gi;
          var resetTokenURL = resetTokenURLRE.exec(resetTokenAnchor);
          UserModel.findOne({ email: fakeUser.email}, function(err, user) {
            resetTokenURL[1].should.equal(urls.edit + '?resetToken=' + user.resetToken);
            done();
          });
        });
        request
          .post(urls.create)
          .redirects(0)
          .send({ 
            user: {
              email: fakeUser.email
            }
          })
          .end();
      });

    });

    describe('when nothing is POSTed', function () {

      it('should redirect back to /password-reset', function (done) {
        request.agent()
          .post(urls.create)
          .redirects(0)
          .send({})
          .end(function (err, res) {
            res.headers.should.have.property('location').match(/\/password-reset$/);
            res.statusCode.should.equal(302)
            done();
          });
      });

      it('should display an error message', function (done) {
        request.agent()
          .post(urls.create)
          .send({})
          .end(function (err, res) {
            res.text.should.include('Please enter a valid email address.');
            done();
          });
      });

    });

    describe('when incorrect credentials are POSTed', function () {

      it('should show an error if email is missing', function (done) {
        request.agent()
          .post(urls.create)
          .send({ 
            user: {}
          })
          .end(function (err, res) {
            res.text.should.include('<title>Password Reset</title>')
            res.text.should.include('Please enter a valid email address.');
            done();
          });
      });

      it('should show an error if email is empty', function (done) {
        request.agent()
          .post(urls.create)
          .send({ 
            user: {
              email: ''
            }
          })
          .end(function (err, res) {
            res.text.should.include('<title>Password Reset</title>')
            res.text.should.include('Please enter a valid email address.');
            done();
          });
      });

      it('should show an error if email is invalid', function (done) {
        request.agent()
          .post(urls.create)
          .send({ 
            user: {
              email: 'testtest.com'
            }
          })
          .end(function (err, res) {
            res.text.should.include('<title>Password Reset</title>')
            res.text.should.include('Please enter a valid email address.');
            done();
          });
      });
    });

  });

  describe('GET /password-reset/edit', function () {

    describe('when resetToken query is URL Safe base64', function () {

      it('should render the edit page', function (done) {
        request.agent()
          .get(urls.edit + '?resetToken=abc_-123')
          .redirects(0)
          .end(function (err, res) {
            res.statusCode.should.equal(200);
            res.text.should.include('<title>Password Reset</title>');
            done();
          });
      });

      it('should render a resetToken field with the query value', function (done) {
        request.agent()
          .get(urls.edit + '?resetToken=abc_-123')
          .redirects(0)
          .end(function (err, res) {
            res.text.should.include('<input type="hidden" name="user[resetToken]" value="abc_-123">')
            done();
          });
      });

    });

    describe('when resetToken query is not URL Safe base64', function () {

      it('should redirect to /password-reset', function (done) {
        request.agent()
          .get(urls.edit + '?resetToken=abc+123')
          .redirects(0)
          .end(function (err, res) {
            res.headers.should.have.property('location').match(/\/password-reset$/);
            res.statusCode.should.equal(302);
            done();
          });
      });

      it('should render an error message', function (done) {
        request.agent()
          .get(urls.edit + '?resetToken=abc+123')
          .end(function (err, res) {
            res.text.should.include('<title>Password Reset</title>')
            res.text.should.include('Your token is invalid.');
            done();
          });
      });

    });

    describe('when resetToken query is not sent', function () {

      it('should redirect to /password-reset', function (done) {
        request.agent()
          .get(urls.edit)
          .redirects(0)
          .end(function (err, res) {
            res.headers.should.have.property('location').match(/\/password-reset$/);
            res.statusCode.should.equal(302);
            done();
          });
      });

      it('should render an error message', function (done) {
        request.agent()
          .get(urls.edit + '?resetToken=abc+123')
          .end(function (err, res) {
            res.text.should.include('<title>Password Reset</title>')
            res.text.should.include('Your token is invalid.');
            done();
          });
      });

    });

  });

});