/**
 * LandingController
 *
 * @description :: Server-side logic for managing landings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  home: function(req, res) {
    res.view('landing/index');
  }

};