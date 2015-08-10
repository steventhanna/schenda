/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  overview: function(req, res) {
    User.findOne({
      id: req.user.id
    }).exec(function(err, user) {
      if (err || user == undefined) {
        console.log("There was an error looking up the logged in user.");
        console.log("Error = " + err);
        console.log("Error Code 0003.0");
        res.serverError();
      } else {
        res.view('dashboard/overview', {
          currentPage: 'overview',
          user: user,
          classes: user.classes
        });
      }
    });
  },

  // This function handles the logic and page view requests for specific class pages
  projectHome: function(req, res) {
    User.findOne({
      id: req.user.id
    }).exec(function(err, user) {
      if (err || user == undefined) {
        console.log("There was an error looking up the logged in user.");
        console.log("Error = " + err);
        console.log("Error Code 0003.0");
        res.serverError();
      } else {
        var url = req.url;
        var classnameEncoded = (url.substring('/class/'.length));
        var classroom = (decodeURI(classnameEncoded));

        // Find the CID associated with that url-name
        var cid = "";
        for (var i = 0; i < user.classes.length; i++) {
          if (user.classes[i].urlName == className) {
            cid = user.classes[i].cid;
          }
        }
        Classroom.findOne({
          cid: cid
        }).exec(function(err, className) {
          if (err) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            console.log("Error Code 0006.0");
            res.serverError();
          } else {
            res.view('dashboard/classHome', {
              user: user,
              classroom: className,
            });
            res.end();
          }
        });
      }
    });
  },
};