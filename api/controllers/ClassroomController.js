/**
 * ClassroomController
 *
 * @description :: Server-side logic for managing classes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  new: function(req, res) {
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
        // Initalize all data to go into a class
        var cid = Math.floor(Math.random() * 1000000000000000000000);
        var name = post.name;
        var tasks = [];
        var completedTasks = [];
        var incompletedTasks = [];
        var projects = [];
        var className = name.split(' ').join('-');
        var notes = [];
        var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

        var classData = {
          cid: cid,
          name: name,
          tasks: tasks,
          completedTasks: completedTasks,
          incompletedTasks: incompletedTasks,
          color: color,
          projects: projects,
          urlName: className,
          notes: notes,
        };

        // Check to see if class name exists already
        var existance = false;
        for (var i = 0; i < user.classes.length; i++) {
          if (className == user.classes[i].className) {
            existance = true;
          }
        }

        if (existance == false) {
          Classroom.create(classData).exec(function(err, newClass) {
            // Handle errors creating hte new Class
            if (err || newClass == undefined) {
              console.log("There was an error creating the new class.");
              console.log("Error = " + err);
              console.log("Error Code 0004.0");
            } else {
              // Add the class to the user
              if (user.classes == null || user.classes == undefined) {
                user.classes = [];
              }
              var classCount = user.classes.length;
              user.classes[classCount] = newClass.cid;
              user.classUrlNames[user.classUrlNames.length] = newClass.urlName;

              // Save the user
              user.save(function(err) {
                if (err) {
                  console.log("There was an error saving the user after creating the new class.");
                  console.log("Error = " + err);
                  console.log("Error Code 0005.0");
                } else {
                  res.send({
                    success: true
                  });
                }
              });
            }
          });
        } else {
          res.send({
            success: false,
            message: "That classname already exists."
          });
        }
      }
    });
  },

  remove: function(req, res) {
    var post = req.body;
    // Find the user on the db
    User.findOne({
      id: req.user.id
    }).exec(function(err, user) {
      if (err || user == undefined) {
        console.log("There was an error looking up the logged in user.");
        console.log("Error = " + err);
        console.log("Error Code 0003.0");
      } else {
        // Find the class to be removed
        Classroom.findOne({
          cid: post.classId
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            console.log("Error Code 00006.0");
            res.serverError();
          } else {

            Classroom.destroy({
              cid: post.classId
            }).exec(function(err) {
              if (err) {
                console.log("There was an error deleting the classroom.");
                console.log("Error = " + err);
                res.serverError();
              } else {
                var id = post.classId;
                var index = user.classes.indexOf(id);
                if (index > -1) {
                  user.classes.splice(index, 1);
                  user.classUrlNames.splice(index, 1);
                }
                user.save(function(err) {
                  if (err) {
                    console.log("There was an error saving the user after updating the class array.");
                    console.log("Error = " + err);
                    console.log("Error Code 0005.0");
                    res.serverError();
                  } else {
                    res.send({
                      success: true,
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  },

  update: function(req, res) {
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
        Classroom.findOne({
          cid: post.classId
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            console.log("Error Code 00006.0");
            res.serverError();
          } else {
            // Find the cid index
            var index = user.classes.indexOf(post.classId);
            if (post.name !== undefined && post.name !== "") {
              // Check to see if the class name already exists.
              var existance = false;
              // Create  the url Name
              var url = post.name.split(' ').join('-');
              for (var i = 0; i < user.classUrlNames.length; i++) {
                if (url === user.classUrlNames[i]) {
                  existance = true;
                }
              }

              if (existance == true) {
                res.send({
                  success: false,
                  error: true,
                  message: "The classname already exists"
                });
              } else {
                className.name = post.name;
                user.classUrlNames[index] = url;
                className.urlName = url;
              }

            }
            if (post.color !== undefined) {
              className.color = post.color;
            }
            // Save everything
            user.save(function(err) {
              if (err) {
                console.log("The user could not be saved.");
                console.log("Error = " + err);
                res.serverError();
              } else {
                className.save(function(err) {
                  if (err) {
                    console.log("The classroom could not be saved.");
                    console.log("Error = " + err);
                    res.serverError();
                  } else {
                    res.send({
                      success: true,
                      error: false,
                      updatedUrl: url
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  },

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
        // console.log("CLASSNAMEENCODED: " + classnameEncoded);
        var classroom = (decodeURI(classnameEncoded));
        // console.log("CLASSROOMDECODED: " + classroom);
        var id = user.classUrlNames.indexOf(classroom);
        Classroom.findOne({
          cid: user.classes[id]
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            res.view('dashboard/classHome', {
              user: user,
              classroom: className,
              currentPage: 'classHome'
            });
          }
        });
      }
    });
  },
};