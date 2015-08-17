/**
 * Classroom.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    cid: {
      type: 'string',
      unique: true
    },

    name: {
      type: 'string',
    },

    color: {
      type: 'string'
    },

    urlName: {
      type: 'string'
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

    projects: {
      type: 'array',
      defaultsTo: '[]'
    },

    notes: {
      type: 'array',
      defaultsTo: '[]'
    }
  }
};