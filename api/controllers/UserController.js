/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
        var classArr = [];
        var userHasNoClasses = false;
        var fullClassList = [];

        var classIterator = classArr.length;
        var iteratorCounter = 0;

        Classroom.find().exec(function(err, allClasses) {
          if (err || allClasses == undefined) {
            console.log("There was an error finding all of the classes.");
            res.serverError();
          } else {
            for (var j = 0; j < allClasses.length; j++) {
              if (iteratorCounter >= classIterator) {
                break;
              }
              for (var i = 0; i < classArr.length; i++) {
                if (classArr[i] == allClasses[i].cid) {
                  fullClassList[fullClassList.length] = allClasses[j];
                  iteratorCounter++;
                }
              }
            }

            if (user.classes == null || user.classes == undefined) {
              user.classes = [];
              user.save(function(err) {
                if (err) {
                  console.log("There was an error saving the user after initalizing a new class array.");
                  res.serverError();
                }
              });
            }

            // Possible error here using user.classes instead of fullClassList
            if (user.classes.length == 0) {
              userHasNoClasses = true;
            }

            console.log("Classes? " + userHasNoClasses);
            console.log("INFO");
            console.log(fullClassList);

            res.view('dashboard/overview', {
              user: user,
              currentPage: 'overview',
              classes: fullClassList,
              userHasNoClasses: userHasNoClasses
            });
          }
        });
      }
    });
  },

  // overview: function(req, res) {
  //   // Lookup the user in the database.
  //   User.findOne({
  //     id: req.user.id
  //   }).exec(function(err, user) {
  //     // Handle errors looking up the user in the database.
  //     if (err || user == undefined) {
  //       console.log("There was an error looking up the user.  Error Code 007");
  //       //Report a 500
  //       res.serverError();
  //     } else {
  //       var classIdList = user.classes;
  //       // console.log(classIdList);
  //       // console.log(classIdList.length);
  //       var allClasses = [];
  //       for (var i = 0; i < classIdList.length; i++) {
  //         Classroom.findOne({
  //           cid: classIdList[i]
  //         }).exec(function(err, className) {
  //           if (err || className == undefined) {
  //             console.log("There was an error looking up the classes from the CID list");
  //             res.serverError();
  //           } else {
  //             allClasses.push(className);
  //             console.log("INSIDE");
  //             console.log(className);
  //             console.log(className.name);
  //           }
  //         });
  //       }
  //       console.log("OUTSIDE");
  //       console.log(allClasses);
  //       console.log(allClasses.length);
  //       res.view('dashboard/overview', {
  //         user: user,
  //         classes: allClasses
  //       });
  //     }
  //   });
  // },

  // overview: function(req, res) {
  //   User.findOne({
  //     id: req.user.id
  //   }).exec(function(err, user) {
  //     if (err || user == undefined) {
  //       console.log("There was an error looking up the logged in user.");
  //       console.log("Error = " + err);
  //       console.log("Error Code 0003.0");
  //       res.serverError();
  //     } else {
  //       // Logic if there are no classes from the user
  //       var userHasNoClasses = false;
  //
  //       // Find all of hte data from the classes for the user that they have stored in their account on the database
  //       function getUserClasses(classArr) {
  //         // A list to hold the classroom data in
  //         var fullClassList = [];
  //
  //         // FInd all of the classes in the database
  //         Classroom.find().exec(function(err, allClassroom) {
  //           // Handle errors for lookign up all the projects in the database
  //           if (err || allClassroom == undefined) {
  //             console.log("There was an error finding all the classrooms.  Error Code 0016.0");
  //             res.serverError();
  //           } else {
  //             // Match all of the user classrooms to the classrooms in the databse to collect all of the relevant data
  //             for (var i = 0; i < classArr.length; i++) {
  //               if (classArr[i] == allClassroom[i].id) {
  //                 // iF the project id's match, then add that to the list that gets sent to the page.
  //                 fullClassList[fullClassList.length] = allClassroom;
  //               }
  //             }
  //             // Return all the user classrooms
  //             return fullClassList;
  //           }
  //         });
  //       }
  //
  //       // If the user has no classes, init the class list in the database
  //       if (user.classes == null || user.classes == undefined) {
  //         user.classes = [];
  //         // Save the updated user accounts
  //         user.save(function(err) {
  //           if (err) {
  //             console.log("There was an error saving the user after initalizing a new classroom array.");
  //             res.serverError();
  //           }
  //         });
  //       }
  //
  //       // If the user has no classes associated with their account, let the page know that
  //       if (user.classes.length == 0) {
  //         userHasNoClasses = true;
  //       }
  //
  //       // Get the classroom information for all the classes associated with the user
  //       var userClasses = getUserClasses(user.classes);
  //
  //       console.log(userClasses);
  //       console.log(userHasNoClasses);
  //
  //       // Send all relevant data to the page
  //       res.view('dashboard/overview', {
  //         user: user,
  //         classes: userClasses,
  //         currentPage: 'overview',
  //         userHasNoClasses: userHasNoClasses,
  //       });
  //     }
  //   });
  // },

  // This function handles the logic and page view requests for specific class pages
  classHome: function(req, res) {
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
          if (user.classes[i].urlName == classroom) {
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
              classroom: className
            });
            res.end();
          }
        });
      }
    });
  },
};