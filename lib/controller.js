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
      user: {} || req.body.email
    });
  };

  // Method: POST
  controller.create = function (req, res, next) {
    // verify email address
    User.findByEmail(req.body.user.email, function (err, user) {

      if (err) {
        // Handle Error
        console.log(err);
        return;
      };

      user.generateEmailToken(function (err, user) {

        if (err) {
          // Handle Error
          console.log(err);
          return;
        };

        user.save(function (err, user) {

          var emailTokenURL = req.protocol + '://' + req.headers.host + req.url + '/edit?emailToken=' + user.emailToken;
          
          res.sendEmail('password-reset/email', {
              to: user.email,
              subject: 'Password Reset',
              emailTokenURL: emailTokenURL
            },
            function (err) {
              if (err) {
                console.log(err)
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