/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 * @author      :: Steven T Hanna
 */

var bcrypt = require('bcrypt-nodejs');

module.exports = {

  attributes: {

    // Login email (username)
    email: {
      type: 'email',
      unique: true
    },

    emailConfirmed: {
      type: 'boolean'
    },

    password: {
      type: 'string'
    },

    firstName: {
      type: 'string'
    },

    lastName: {
      type: 'string'
    },

    displayName: {
      type: 'string'
    },

    // Remove the password from the returned JSON object
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    },

  },

  // Hash the password before it is ever stored in the db
  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function() {}, function(err, hash) {
        if (err) {
          console.log(err);
        } else {
          user.password = hash;
          cb(null, user);
        }
      });
    });
  }

};