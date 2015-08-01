/*
 * @File: 		config/application.js
 * @Created: 	July 2015
 * @Updated: 	July 27, 2015
 * @Description: This file handles logins and serial-desserializations
 * @Author: Steven T Hanna
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function findByUsername(username, fn) {
  User.findOne({
    email: username
  }).exec(function(err, user) {
    if (err || user == undefined) {
      console.log("There was an error looking up the user with the meail " + username + " in the User Database.");
      console.log("Error = " + err);
      return fn("USER NOT FOUND ON DATABASE!", null);
    } else {
      return fn(null, user);
    }
  });
}

// Passport seession setup
// To support persistent login session, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically
// this will be as simle as sotring the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// passport.deserializeUser(function(id, done) {
//   User.findOne({
//     id: id
//   }).exec(function(err, user) {
//     if (err || user == undefined) {
//       console.log("There was an error looking up the user with the id " + id + " in the User Database");
//       console.log("Error = " + err);
//       return done("NOT IN THE USER DATABASE", null);
//     } else {
//       return done(null, user);
//     }
//   });
// });

// Use the LocalStrategy within Passport.
// Strategies in passport require a 'verify' function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.

passport.use(new GoogleStrategy({
    clientID: "139008887262-3uv5hn6m6mppsj0osaoeecv64nl8fpgs.apps.googleusercontent.com",
    clientSecret: "CQw1SSqI-3yCyvaJa0KBg7o-",
    callbackURL: "http://127.0.0.1:1337/auth/google/callback/"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return done(err, user);
    });
  }
));

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     // Asynchronous verification.  Neet to double check nextTick
//     process.nextTick(function() {
//       // Find the user by username.  If there is no user with the given username, password is not correct
//       // Set the user to false to indicate failure and set a flash message
//       // Otherwise return the authenticated user
//       fundByUsername(username, function(err, user) {
//         if (err) {
//           return done(err);
//         } else if (!user) {
//           return done("User Not Found", null, {
//             message: "Unknown user " + username
//           });
//         } else {
//           bcrypt.compare(password, user.password, function(err, res) {
//             if (req != true) {
//               return done("Invalid Password", null, {
//                 message: "Invalid Password"
//               });
//             } else {
//               return done(null, user);
//             }
//           });
//         }
//       });
//     });
//   }
// ));


module.exports = {
  appName: 'schenda',

  // Custom epresss middleware - we use this to register the passport middleware
  http: {
    customMiddleware: function(app) {
      app.use(passport.initialize());
      app.use(passport.session());
      app.use(app.router);
    }
  }
};