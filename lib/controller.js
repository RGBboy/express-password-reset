/**
 * Password Reset Controller
 *
 * @todo Change so the view shows nice errors to the user.
 * @todo Change that POST routes do not render, they redirect.
 * @todo Check req.headers.host does not include port number in production.
 */

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
          
          res.sendEmail('password-reset/email', {
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

  return controller;

};