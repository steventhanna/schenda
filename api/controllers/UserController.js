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
    // SORT BY CLASS ATTRIBUTE
    function dynamicSort(property) {
      var sortOrder = 1;
      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function(a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
      }
    }
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
        // Get the classes
        var classIds = user.classes;
        var finalClassList = [];
        if (classIds.length > 0) {
          for (var i = 0; i < classIds.length; i++) {
            if (finalClassList.length == classIds.length) {
              res.view('dashboard/overview', {
                user: user,
                classes: finalClassList,
                tasks: undefined,
                projects: undefined,
              });
            } else {
              Classroom.findOne({
                cid: classIds[i]
              }).exec(function(err, className) {
                if (err || className == undefined) {
                  console.log("There was an error looking up the classroom.");
                  console.log("Error = " + err);
                  res.serverError();
                } else {
                  finalClassList.push(className);
                  if (finalClassList.length == classIds.length) {
                    // All classes have been found.  get all tasks and projects
                    // NOTE :: Terribly inefficient
                    var fullTaskList = [];
                    var fullProjectList = [];
                    for (var i = 0; i < finalClassList.length; i++) {
                      for (var j = 0; j < finalClassList[i].tasks.length; i++) {
                        fullTaskList.push(finalClassList[i].tasks[j]);
                      }
                      for (var j = 0; j < finalClassList[i].projects.length; i++) {
                        fullProjectList.push(finalClassList[i].projects[j]);
                      }
                    }
                    var taskComplete = false;
                    var projectComplete = false;
                    // Get actual info from db
                    var actualTaskList = [];
                    if (fullTaskList.length > 0) {
                      for (var i = 0; i < fullTaskList.length; i++) {
                        Task.findOne({
                          tid: fullTaskList[i]
                        }).exec(function(err, taskName) {
                          if (err || taskName == undefined) {
                            console.log("There was an error looking up the task name");
                            console.log("Error = " + err);
                            res.serverError():
                          } else {
                            actualTaskList.push(taskName);
                            // If complete sort
                            if (actualTaskList.length == fullTaskList.length) {
                              actualTaskList.sort(dynamicSort('duedate'));
                              taskComplete = true;
                              break;
                            }
                          }
                        });
                      }
                    }
                    var actualProjectList = [];
                    if (fullProjectList.length > 0) {
                      for (var i = 0; i < fullProjectList.length; i++) {
                        Project.findOne({
                          pid: fullProjectList[i]
                        }).exec(function(err, projectName) {
                          if (err || projectName == undefined) {
                            console.log("There was an error looking up the project.");
                            console.log("Error = " + err);
                            res.serverError();
                          } else {
                            actualProjectList.push(projectName);
                            // If complete sort
                            if (actualProjectList.length == fullProjectList.length) {
                              actualProjectList.sort(dynamicSort('dueDate'));
                              projectComplete = true;
                              break;
                            }
                          }
                        });
                      }
                    }
                    if (projectComplete == true && taskComplete == true) {
                      // Everything should be done... Send it to the page
                      res.view('dashboard/overview', {
                        user: user,
                        classes: finalClassList,
                        tasks: actualTaskList,
                        projects: actualProjectList
                      });
                    }
                  }
                }
              });
            }
          }
        }
      }
    });
  },

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