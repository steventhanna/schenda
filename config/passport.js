/**
 * Passport configuration
 *
 * This is the configuration for your Passport.js setup and where you
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({
    id: id
  }, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(email, password, done) {

    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect email.'
        });
      }

      bcrypt.compare(password, user.password, function(err, res) {
        if (!res)
          return done(null, false, {
            message: 'Invalid Password'
          });
        var returnUser = {
          email: user.email,
          createdAt: user.createdAt,
          id: user.id
        };
        return done(null, returnUser, {
          message: 'Logged In Successfully'
        });
      });
    });
  }
));



// local: {
//   strategy: require('passport-local').Strategy
// },

// bearer: {
//   strategy: require('passport-http-bearer').Strategy
// },

// twitter: {
//   name: 'Twitter',
//   protocol: 'oauth',
//   strategy: require('passport-twitter').Strategy,
//   options: {
//     consumerKey: 'your-consumer-key',
//     consumerSecret: 'your-consumer-secret'
//   }
// },

// github: {
//   name: 'GitHub',
//   protocol: 'oauth2',
//   strategy: require('passport-github').Strategy,
//   options: {
//     clientID: 'your-client-id',
//     clientSecret: 'your-client-secret'
//   }
// },

// facebook: {
//   name: 'Facebook',
//   protocol: 'oauth2',
//   strategy: require('passport-facebook').Strategy,
//   options: {
//     clientID: 'your-client-id',
//     clientSecret: 'your-client-secret',
//     scope: ['email'] /* email is necessary for login behavior */
//   }
// },

// google: {
//   name: 'Google',
//   protocol: 'oauth2',
//   strategy: require('passport-google-oauth').OAuth2Strategy,
//   options: {
//     clientID: '139008887262-3uv5hn6m6mppsj0osaoeecv64nl8fpgs.apps.googleusercontent.com',
//     clientSecret: 'CQw1SSqI-3yCyvaJa0KBg7o-',
//     callbackURL: "http://127.0.0.1:1337/auth/google/callback"
//   }
// },

// cas: {
//   name: 'CAS',
//   protocol: 'cas',
//   strategy: require('passport-cas').Strategy,
//   options: {
//     ssoBaseURL: 'http://your-cas-url',
//     serverBaseURL: 'http://localhost:1337',
//     serviceURL: 'http://localhost:1337/auth/cas/callback'
//   }
// }
module.exports = {

  appName: 'Schenda',

  // Custom express middleware - we use this to register the passport middleware
  http: {
    customMiddleware: function(app) {
      app.use(passport.initialize());
      app.use(passport.session());
      app.use(app.router);
    }
  }

};