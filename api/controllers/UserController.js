/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// Initalize dependencies
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;

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



module.exports = {

  dashboard: function(req, res) {
    // Lookup user in Database
    User.findOne({
      id: req.user.id
    }).exec(function(err, user) {
      // Handle errors that could come from looking up the user in the database
      if (err || user == undefined) {
        console.log("There was an error looking up the user.");
        res.serverError();
      } else {
        res.view('dashboard/dash', {
          user: user
        });
      }
    });
  },



};