# Express Password Reset

User Password Reset for your Express Applications

[![Build Status](https://secure.travis-ci.org/RGBboy/express-password-reset.png)](http://travis-ci.org/RGBboy/express-password-reset)

## Installation

Works with Express 3.0.x

    npm install express-password-reset

## Usage

Require it:

``` javascript
  var Signin = require('express-signin'),
      PasswordReset = require('express-password-reset'),
      express = require('express'),
      mongoose = require('mongoose'),
      app = express(),
      namedRoutes = require('express-named-routes'),
      attach = require('attach'),
      mailer = require('express-mailer'),
      shared = {
        model: function () {
          return mongoose.model.apply(mongoose, arguments);
        }
      },
      signin = Signin(shared),
      passwordReset = PasswordReset(shared);

  namedRoutes.extend(app);
  attach.extend(app);

  mailer.extend(app);

  // Views
  self.set('views', __dirname + '/views');
  self.set('view engine', 'jade');
  self.set('view options', { layout: false });

  // Middleware
  self.use(express.bodyParser());
  self.use(express.cookieParser('my little secret'));
  self.use(express.session({ cookie: { maxAge: 60000 }}));
  self.use(flash());

  // Signin Component
  app.defineRoute('signin', '/some/url/to/signin/base');
  app.attach('signin', signin);

  // Reset Password Component
  app.defineRoute('password-reset', '/some/url/to/password-reset/base');
  app.attach('password-reset', passwordReset);

```

## Requires

### Extensions

The following extensions should be used by the application in order to
use the Password Reset Component:

* express-mailer

### Components

The following components should be attached to the application in order to
use the Password Reset Component:

* express-signin

### Middleware

The following middleware should be used by the application before the 
Password Reset Component:

* express.bodyParser
* express.cookieParser
* express.session
* express-flash

### Views

The following views should be made available in your view directory:

* ./password-reset/index
* ./password-reset/edit
* ./email/password-reset

### Other

Express Password Reset requires a User Model to be accessible via the 
shared.model('User') in upon construction. The User Model needs to 
implement the following:

#### User.findByEmail(email, function (err, user) {})

The `.findByEmail` method takes an email string as an argument and a 
callback. The callback should respond with an error or the user.

#### User.findByResetToken(resetToken, function (err, user) {})

The `.findByResetToken` method takes an token string as an argument and a 
callback. The callback should respond with an error or the user.

#### userInstance.generateResetToken(function (err, user) {})

The `.generateResetToken` method takes a callback. This method should update 
the resetToken variable on the user. The callback should respond with an error 
or the user.

## Setting Up Development

In order to develop and run tests with the supplied example you will 
need to set up MongoDB with two databases:

* express-password-reset-test
* express-password-reset-dev

The usernames and passwords for each are the same as their database names.

## Todo

* Change so the view shows nice errors to the user.
* Add restrictions to routes!
* Add unit tests for nice errors in .create route;
* Add unit tests for nice errors in .edit route;
* Pass in the action URL to each form via req.routeToPath();

## License 

(The MIT License)

Copyright (c) 2013 RGBboy &lt;me@rgbboy.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.