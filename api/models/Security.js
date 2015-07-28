/**
 * Security.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  adapter: "mongo",

  attributes: {

    resetPassword: {
      type: 'boolean',
      defaultsTo: false
    },
    resetToken: {
      type: 'integer',
      unique: true
    },
  }
};