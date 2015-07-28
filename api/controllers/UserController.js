/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// Initalize dependencies
var bcyprt = require('bcrypt-nodejs');
var passport = require('passport');

// Debug object to log debug statements
var debug = {
  on: false,
  log: function(message) {
    if (this.on == true) {
      console.log("Debug: " + message);
    }
  }
}

// Turn on debug
debug.on = true;

var _ = require('lodash');
var _super = require('sails-auth/api/controllers/UserController');

_.merge(exports, _super);
_.merge(exports, {

    };