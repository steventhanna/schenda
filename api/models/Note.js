/**
 * Note.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    nid: {
      type: 'string',
      unique: true
    },

    name: {
      type: 'string'
    },

    description: {
      type: 'string'
    },

    body: {
      type: 'string',
    },

    // MM/DD/YYYY
    dateCreated: {
      type: 'string'
    },

    dateUpdated: {
      type: 'string'
    },
  }
};