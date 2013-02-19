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
  }

  return controller;

};