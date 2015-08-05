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

    var accountDetails = {
      email: post.email,
      password: post.password,
      displayName: post.firstName + " " + post.lastName,
      firstName: post.firstName,
      lastName: post.lastName
    };

    User.create(accountDetails).exec(function(err, user) {
      if (err || user == undefined) {
        console.log("There was an error creating the user account on the database.");
        console.log("Error = " + err);
        console.log("Error Code 0001.0");
        console.log("Account Details: ");
        console.log(accountDetails);

        res.serverError();
      } else {
        req.logIn(user, function(err) {
          if (err) {
            console.log("There was an error when trying to login the user after the account was just created.");
            console.log("Error = " + err);
            console.log("Error Code 0001.1");
            console.log("User Account: ");
            console.log(user);

            res.serverError();
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

  login: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if (err || (!user)) {
        console.log("user = " + user);
        console.log("err = " + err);
        console.log("info = ");
        console.log(info);

        res.send({ success: false, errorMessage: "This user does not exist or there was some sort of error. "});
      } else if ((!err) && user) {
        req.logIn(user, function(err) {
          if (err) {
            console.log("There was an error logging the user.");
            console.log("Error = " + err);
            console.log("Error Code 0002.0");
            console.log("Users Account: ");
            console.log(user);

            res.serverError();
            return;
          } else {
            res.send({
              success: true
            });
          }
        });
      } else {
        res.send({
          success: false
        });
      }
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
