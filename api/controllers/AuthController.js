/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
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
  /*
   * This function handles the logging out of users
   */
  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },

  /*
   * Will eventually phase login page out in favor of using just a button on
   * the home page.
   */
  login: function(req, res) {
    // res.view('landing/login');
    res.view('/');
  },

  register: function(req, res) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      failureRedirect: '/'
    }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log("There was an error signing in the user");
          console.log("Error: " + err);
          res.serverError();
        } else {
          console.log("Next step");
        }
      });
    })(req, res);
  },

  callback: function(req, res) {
    passport.authenticate('google', {
      failureRedirect: '/'
    }, function(err, profile) {
      // Handle errors looking up the user
      if (err || profile == undefined) {
        console.log("There was an error authenticating the user.");
        res.serverError();
      } else {
        // Get the user off the Database
        User.findOrCreate({
          id: req.user.id
        }).exec(function(err, user) {
          // Handle errors lookng up the user
          if (err || user == undefined) {
            console.log("There was an error looking up the authenticated user.");
            res.serverError();
          } else {
            // Execute server side code here.
            console.log("Good to go");
          }
        });
      }
    });
  },

  /*
   * This function handles github authentication and github authentication callbacks (for more information on the middleware visit config/application.js)
   */
  authGoogle: function(req, res) {
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    });
  },
};