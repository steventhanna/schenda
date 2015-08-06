/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    pid: {
      type: 'string'
    },

    name: {
      type: 'string'
    },

    // MM/DD/YY
    dueDate: {
      type: 'string',
    },

    tasks: {
      type: 'array',
      defaultsTo: '[]'
    },
  }
};