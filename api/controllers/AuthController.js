/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// Initalize dependencies
var bcrypt = require('bcrypt-nodejs');
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
var _super = require('sails-auth/api/controllers/AuthController');

_.merge(exports, _super);
_.merge(exports, {

  renderSignIn: function(req, res) {
    res.view('landing/login');
  },

  login: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        console.log("user = " + user);
        console.log("err = " + err);
        console.log("info = " + info);
        // Eventually replace with a send message
        res.view('auth/loignError');
      } else if (!err && user) {
        req.logIn(user, function(err) {
          if (err) {
            res.serverError();
            return;
          } else {
            res.send({
              success: true,
            });
          }
        })
      }
    })(req, res);
  },

  renderSignUp: function(req, res) {
    res.view('landing/signup');
  },

  signup: function(req, res) {
    var post = req.body;
    var token = Math.floor(Math.random() * 1000000000000000000000);
    var uid = Math.floor(Math.random() * 1000000000000000000000);

    var userAccountData = {
      uid: token,
      email: post.email,
      password: post.password,
      emailConfirmed: false,
      firstName: post.firstName,
      lastName: post.lastName,
      displayName: post.firstName + " " + post.lastName
    };

    Usr.create(userAccountData).exec(function(err, user) {
      if (err || user == undefined) {
        console.log("There was an error when creating the user account on the database.");
        console.log("Error Code 0001");
        console.log("Error = " + err);
        console.log("User Account: ");
        console.log(user);
      } else {
        user.save(function(err) {
          if (err) {
            console.log("Unable to save profile.");
          }
        });
        req.logIn(user, function(err) {
          if (err) {
            res.serverError;
            return;
          } else {
            res.send({
              success: true
            });
          }
        });
      }
    });
  },

  logout: function(req, res) {
    req.logout();
    res.redirect("/");
    res.end();
  },
});