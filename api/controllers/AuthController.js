/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  signup: function(req, res) {
    var post = req.body;
    var uid = Math.floor(Math.random() * 1000000000000000000000);

    var accountData = {
      email: post.email,
      firstName: post.firstName,
      password: post.password,
      lastName: post.lastName,
      uid: uid,
      displayName: post.firstName + " " + post.lastName
    };

    User.create(accountData).exec(function(err, user) {
      if (err || user == undefined) {
        console.log("There was an error when creating hte user account on the database.");
        console.log("Error = " + err);
        console.log(user);
      } else {
        req.logIn(user, function(err) {
          if (err) {
            res.serverError();
            console.log("Could not log user in.");
            return;
          } else {
            console.log("User logged in");
            res.send({
              success: true
            });
          }
        });
      }
    });
  },

  login: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: info.message,
          user: user
        });
      }
      req.logIn(user, function(err) {
        if (err) {
          res.send(err);
        }
        return res.send({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },

  renderSignUp: function(req, res) {
    res.view('landing/signup');
  },

  renderLogin: function(req, res) {
    res.view('landing/login');
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },

};