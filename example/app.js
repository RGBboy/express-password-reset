/*!
 * express-password-reset example
 */

/**
 * Module dependencies.
 */

var express = require('express'),
    fs = require('fs'),
    https = require('https'),
    mongoose = require('mongoose'),
    Storekeeper = require('storekeeper'),
    namedRoutes = require('express-named-routes'),
    attach = require('attach'),
    flash = require('express-flash'),
    authenticate = require('express-authenticate'),
    UserSchema = require('basic-user-schema'),
    mailer = require('express-mailer'),
    Signin = require('express-signin'),
    PasswordReset = require('../index'),
    silent = 'test' === process.env.NODE_ENV;

/**
 * Module Exports
 */

exports = module.exports = function (config) {

  var self = express(),
      shared = {
        model: function () {
          return mongoose.model.apply(mongoose, arguments);
        }
      },
      signin = Signin(shared),
      passwordReset = PasswordReset(shared);

  namedRoutes.extend(self);
  attach.extend(self);

  // Mailer
  mailer.extend(self, config.mailer);

  function init () {

    // Connect to DB
    if (!mongoose.connection.db) {
      mongoose.connect(config.db.url);
    };

    // Schemas
    shared.model('User', UserSchema());

    // Define Named Routes
    self.defineRoute('index', '/');
    self.defineRoute('signin', '/'); // signin will be attached here
    self.defineRoute('password-reset', '/password-reset'); // password-reset will be attached here

    // Views
    self.set('views', __dirname + '/views');
    self.set('view engine', 'jade');
    self.set('view options', { layout: false });

    // Configuration
    self.use(express.bodyParser());
    self.use(express.static(__dirname + '/public'));
    self.use(express.cookieParser(config.cookieSecret));
    self.use(express.session({ cookie: { maxAge: 60000 }}));
    self.use(authenticate(shared.model('User')));
    self.use(flash());

    // Sign In

    self.attach('signin', signin);

    self.attach('password-reset', passwordReset);

    self.get('/', function (req, res) {
      res.render('index', {
        title: 'Home'
      });
    });

    // Error Handler
    self.use(express.errorHandler());

  };

  function ready () {
    self.emit('ready');
  };

  signin.on('init', init);
  signin.on('ready', ready);

  return self;

};

if (!module.parent) {
  var config = require('./config'),
      app = module.exports(config),
      server;
  app.on('ready', function () {
    server = https.createServer({
      key: fs.readFileSync(__dirname + '/ssl/key.pem'),
      cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
    }, app);
    server.listen(config.httpsPort);
    silent || console.log('Application started on port ' + config.httpsPort + ' in ' + (process.env.NODE_ENV || 'development') + ' mode.');
  });
};