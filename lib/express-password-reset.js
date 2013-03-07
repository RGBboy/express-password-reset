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

    // Define Routes
    self.defineRoute('index', '/');
    self.defineRoute('new', '/');
    self.defineRoute('create', '/');
    self.defineRoute('edit', '/edit');
    self.defineRoute('update', '/update');

    // Attach Routes to Controller
    self.get(self.lookupRoute('new'), controller.new);
    self.post(self.lookupRoute('create'), controller.create);
    self.get(self.lookupRoute('edit'), controller.edit);
    self.post(self.lookupRoute('update'), controller.update);

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

exports.version = '0.0.4';