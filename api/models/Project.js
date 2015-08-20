/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    pid: {
      type: 'string',
      unique: true
    },

    name: {
      type: 'string'
    },

    status: {
      type: 'string',
    },

    description: {
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

    completedTasks: {
      type: 'array',
      defaultsTo: []
    },

    incompletedTasks: {
      type: 'array',
      defaultsTo: []
    },
  }
};