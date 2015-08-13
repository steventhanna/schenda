/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require("async");

var debug = {
  on: false,
  log: function(message, data) {
    if (this.on == true) {
      console.log("=== BEGIN DEBUG ===");
      console.log("Message: " + message);
      console.log(data);
      console.log("=== END DEBUG === ");
    }
  }
}

// turn on debug
debug.on = true;

module.exports = {

  overview: function(req, res) {
    var post = req.body;
    User.findOne({
      id: req.user.id
    }).exec(function(err, user) {
      if (err || user == undefined) {
        console.log("There was an error looking up the logged in user.");
        console.log("Error = " + err);
        console.log("Error Code 0003.0");
        res.serverError();
      } else {
        // Get the Classes
        var classIds = user.classes;
        var finalClassList = [];
        if (classIds.length > 0) {
          for (var i = 0; i < classIds.length; i++) {
            if (finalClassList.length == classIds.length) {
              res.view('dashboard/overview', {
                user: user,
                classes: finalClassList
              });
            } else {
              Classroom.findOne({
                cid: classIds[i]
              }).exec(function(err, className) {
                if (err || className == undefined) {
                  console.log("There was an error looking up the class in the for loop.");
                  res.serverError();
                } else {
                  finalClassList.push(className);
                  if (finalClassList.length == classIds.length) {
                    res.view('dashboard/overview', {
                      user: user,
                      classes: finalClassList
                    });
                  }
                }
              });
            }
          }
        } else {
          res.view('dashboard/overview', {
            user: user,
            classes: finalClassList
          });
        }
      }
    });
  },
};