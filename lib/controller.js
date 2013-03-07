/**
 * Password Reset Controller
 *
 * @todo Change so the view shows nice errors to the user.
 * @todo Change that POST routes do not render, they redirect.
 * @todo Check req.headers.host does not include port number in production.
 */

/**
 * Module Dependencies
 */

var URLSafeBase64 = require('urlsafe-base64');

/**
 * Module Exports
 */

exports = module.exports = function (User) {

  var controller = {};

  // Method: GET
  controller.new = function (req, res, next) {
    //display page to enter email address
    res.render('password-reset', {
      title: 'Password Reset',
      user: {}
    });
  };

  // Method: POST
  controller.create = function (req, res, next) {
    if (!req.body.user || !req.body.user.email) {
      req.flash('error', 'Please enter a valid email address.');
      res.redirect(req.routeToPath('new'));
      return;
    };
    // verify email address
    User.findByEmail(req.body.user.email, function (err, user) {

      if (err) {
        next(err);
        return;
      };

      if (!user) {
        req.flash('error', 'Please enter a valid email address.');
        res.redirect(req.routeToPath('new'));
        return;
      };

      user.generateResetToken(function (err, user) {

        if (err) {
          next(err);
          return;
        };

        user.save(function (err, user) {

          var resetTokenURL = req.protocol + '://' + req.headers.host + req.url + '/edit?resetToken=' + user.resetToken;
          
          res.mailer.send('email/password-reset', {
              to: user.email,
              subject: 'Password Reset',
              resetTokenURL: resetTokenURL
            },
            function (err) {
              if (err) {
                next(err);
                return;
              }
              req.flash('info', 'Please check your email for instructions on resetting your password.');
              res.redirect('/');
            });

          });

      });

    });
  };

  // Method: GET
  //
  controller.edit = function (req, res, next) {
    // Sanitise req.query.resetToken
    if (!req.query.resetToken || !URLSafeBase64.validate(req.query.resetToken)) {
      req.flash('error', 'Your reset token is invalid.');
      res.redirect(req.routeToPath('new'));
      return;
    };
    res.render('password-reset/edit', {
      title: 'Password Reset',
      user: {
        resetToken: req.query.resetToken
      }
    });
  };

  // Method: POST
  //
  controller.update = function (req, res, next) {

    if(!req.body.user || !req.body.user.resetToken) {
      req.flash('error', 'Your reset token is invalid.');
      res.redirect(req.routeToPath('new'));
      return;
    };

    // verify token address
    User.findByResetToken(req.body.user.resetToken, function (err, user) {

      if (err) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect(req.routeToPath('edit') + '?resetToken=' + req.body.user.resetToken);
        return;
      };

      if (!user) {
        req.flash('error', 'Your reset token is invalid.');
        res.redirect(req.routeToPath('new'));
        return;
      };

      user.password = req.body.user.password;
      user.passwordConfirm = req.body.user.passwordConfirm;

      user.save(function (err, user) {

        if (err) {
          req.flash('error', 'Something went wrong. Please try again.');
          res.redirect(req.routeToPath('edit') + '?resetToken=' + req.body.user.resetToken);
          return;
        };

        req.flash('info', 'Your password has been successfully reset. Please sign in.');
        res.redirect(req.routeToPath('signin.index'));

      });

    });

  };

  return controller;

};