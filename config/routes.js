/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': {
    controller: 'landing',
    action: 'home',
  },

  'POST /signin': {
    controller: 'auth',
    action: 'login'
  },

  'GET /signup': {
    controller: 'auth',
    action: 'renderSignUp'
  },

  'POST /signup': {
    controller: 'auth',
    action: 'signup'
  },

  '/overview': {
    controller: 'user',
    action: 'overview'
  },

  'GET /login': {
    controller: 'auth',
    action: 'renderLogin'
  },

  'GET /logout': {
    controller: 'auth',
    action: 'logout'
  },

  'GET /overview': {
    controller: 'user',
    action: 'overview'
  },

  'POST /class/new': {
    controller: 'classroom',
    action: 'new'
  },

  'POST /class/remove': {
    controller: 'classroom',
    action: 'remove'
  },

  'POST /class/update': {
    controller: 'classroom',
    action: 'update'
  },

  'GET /class/:className': {
    controller: 'classroom',
    action: 'classHome'
  },

  'GET /class/:className/tasks': {
    controller: 'task',
    action: 'tasks'
  },

  'GET /class/:className/projects': {
    controller: 'user',
    action: 'projects'
  },

  'GET /class/:className/notes': {
    controller: 'note',
    action: 'notes'
  },

  'GET /class/:className/notes/:noteID': {
    controller: 'note',
    action: 'specificNote'
  },

  'GET /class/:className/tasks/:taskID': {
    controller: 'task',
    action: 'specificTask'
  },

  'POST /task/new': {
    controller: 'task',
    action: 'new'
  },

  'POST /task/status': {
    controller: 'task',
    action: 'status'
  },

  'POST /task/update': {
    controller: 'task',
    action: 'update'
  },

  'POST /note/new': {
    controller: 'note',
    action: 'new'
  },

  'POST /note/updateBody': {
    controller: 'note',
    action: 'updateBody'
  },


  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

};