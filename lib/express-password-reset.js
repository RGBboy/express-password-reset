/*!
 * express-password-reset
 * Copyright(c) 2013 RGBboy <me@rgbboy.com>
 * MIT Licensed
 */

/**
 * Module Dependencies
 */

var EventEmitter = require('events').EventEmitter,
    routable = require('routable'),
    Controller = require('./controller');

/**
 * Return a password-reset instance
 *
 * @param {Object} shared
 * @return {Object} self
 * @api public
 */

exports = module.exports = function (shared) {

  var self = new EventEmitter(),
      User;

  routable.extend(self);

  function attach() {

    // instantiate controller
    var controller = Controller(shared.model('User'));

    // index is rewritten to be base route + /signin, because
    // this is normally mounted to the app index ('/')
    self.defineRoute('index', '/');
    self.defineRoute('new', '/');

    // Should these only be available to anonymous users? Yes!
    self.get(self.lookupRoute('new'), controller.new);

    self.emit('ready', self);

  };

  self.on('attached', attach);

  process.nextTick(function () {
    self.emit('init', self);
  });

  return self;

};

/**
 * Library version.
 */

exports.version = '0.0.1';