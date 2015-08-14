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
        var projects = [];
        var className = name.split(' ').join('-');
        var notes = [];
        var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

        var classData = {
          cid: cid,
          name: name,
          tasks: tasks,
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
            // Find location of class in array
            var id = post.classId;
            var index = user.classes.indexOf(id);
            if (index > -1) {
              user.classes.splice(index, 1);
              user.classUrlNames.splice(index, 1);
            }


            // Update the user
            // Save the user
            user.save(function(err) {
              if (err) {
                console.log("There was an error saving the user after updating the class array.");
                console.log("Error = " + err);
                console.log("Error Code 0005.0");
              } else {
                Classroom.destroy({
                  cid: post.classId
                }).exec(function(err) {
                  if (err) {
                    console.log("The class could not be destroyed from the database.");
                    console.log("Error = " + err);
                    console.log("Error Code 0007.0");
                    res.serverError();
                  } else {
                    res.send({
                      success: true
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
              for (var i = 0; i < user.urlNames.length; i++) {
                if (url === user.urlNames[i]) {
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
            if (post.color !== undefined && post.color !== "") {
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
        // Find out what has been altered
        var classId = post.cid; // This must be present
        var name = post.name;
        var color = post.color;
        if (name !== undefined && name !== null) {
          var urlname = name.split(' ').join('-');
        }

        console.log(color);
        console.log(name);
        // No data sent
        if (name == undefined && color == undefined) {
          console.log("No data sent to be updated");
          res.send({
            success: false,
            message: "No data sent."
          });
        } else {
          // Look through db and see if that name already exists
          var counter = 0;
          var there = false;
          if (urlname !== undefined) {
            while (counter < user.classUrlNames) {
              if (urlname === user.classUrlNames[counter]) {
                there = true;
                break;
              } else {
                counter++;
              }
            }
            if (there == true) {
              console.log("Name already exists.");
              res.send({
                success: false,
                error: true,
              });
            }
          }

          Classroom.findOne({
            cid: classId
          }).exec(function(err, className) {
            if (err || className == undefined) {
              console.log("There was an error looking up the class.");
              console.log("Error = " + err);
              console.log("Error Code 00006.0");
              res.serverError();
            } else {
              var updatedUrl = false;
              if (name !== undefined) {
                className.name = name;
                className.urlName = urlname;
                user.classUrlNames = urlname;
                updatedUrl = true;
              }
              if (color !== undefined || color !== " ") {
                className.color == color;
              }
              user.save(function(err) {
                if (err) {
                  console.log("There was an error updating the class information on the user.");
                  console.log("Error = " + err);
                  console.log("Error Code 00007.0");
                  res.serverError();
                } else {
                  className.save(function(err) {
                    if (err) {
                      console.log("There was an error updating the class information.");
                      console.log("Error = " + err);
                      console.log("Error Code 00007.0");
                      res.serverError();
                    } else {
                      // if (updatedUrl == true) {
                      //   res.redirect('/class/' + className.urlName);
                      // }
                      res.send({
                        success: true,
                        updatedUrl: updatedUrl,
                        url: className.urlName,
                      });
                    }
                  });
                }
              });
            }
          });
        }
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