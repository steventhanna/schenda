/**
 * LandingController
 *
 * @description :: Server-side logic for managing landings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  home: function(req, res) {
    var post = req.body;
    if (req.user) {
      User.findOne({
        id: req.user.id
      }).exec(function(err, user) {
        if (err || user == undefined) {
          // console.log("There is an error looking up the user.");
          // console.log("Error = " + err);
          // res.serverError();
          res.view('landing/index', {
            user: null
          });
        } else {
          res.view('landing/index', {
            user: user
          });
        }
      });
    } else {
      res.view('landing/index', {
        user: null,
      });
    }
  },

};