/**
 * Task.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    tid: {
      type: 'string',
      unique: true
    },

    name: {
      type: 'string'
    },

    note: {
      type: 'string'
    },

    status: {
      type: 'string',
      defaultsTo: 'incomplete'
    },

    // MM/DD/YYYY
    dueDate: {
      type: 'string'
    },
  }
};