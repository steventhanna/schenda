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

  tasks: function(req, res) {
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
        // Get the cid
        var url = req.url;
        var array = url.split("/");
        var index = user.classUrlNames.indexOf(array[2]);
        var cid = user.classes[index];

        console.log(cid);

        // var cid = post.classId;
        Classroom.findOne({
          cid: cid
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            res.serverError();
          } else {
            console.log("CLASS FOUND");
            console.log(className.name);
            console.log(className.tasks);
            var taskIds = className.tasks;
            console.log("CLASS IDS");
            console.log(taskIds);
            if (taskIds.length > 0) {
              var finalTaskList = [];
              for (var i = 0; i < taskIds.length; i++) {
                if (finalTaskList.length == taskIds.length) {
                  res.view('dashboard/tasks', {
                    user: user,
                    classroom: className,
                    tasks: null,
                    currentPage: 'tasks'
                  });
                } else {
                  console.log("FINAL: " + finalTaskList.length);
                  console.log("TID LIST: " + taskIds.length);
                  console.log(finalTaskList);

                  Task.findOne({
                    tid: taskIds[i]
                  }).exec(function(err, taskName) {
                    if (err || taskName == undefined) {
                      console.log("There was an error lookign up the task.");
                      res.serverError();
                    } else {
                      console.log(taskName);
                      finalTaskList.push(taskName);
                      console.log("FINAL: " + finalTaskList.length);
                      console.log("TID LIST: " + taskIds.length);
                      if (finalTaskList.length == taskIds.length) {
                        res.view('dashboard/tasks', {
                          user: user,
                          classroom: className,
                          tasks: finalTaskList,
                          currentPage: 'tasks'
                        });
                      }
                    }
                  });
                  console.log(finalTaskList);
                }
              }
            } else {
              res.view('dashboard/tasks', {
                user: user,
                classroom: className,
                tasks: finalTaskList,
                currentPage: 'tasks'
              });
            }
          }
        });
      }
    });
  },

  specificTask: function(req, res) {
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
        // Get the classname
        var url = req.url;
        var array = url.split("/");
        var index = user.classUrlNames.indexOf(array[2]);
        var cid = user.classes[index];
        var tid = array[4];
        Classroom.findOne({
          cid: cid
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error locating the class from the database.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            Task.findOne({
              tid: tid
            }).exec(function(err, taskName) {
              if (err || taskName == undefined) {
                console.log("There was an error locating the task from the database.");
                console.log("Error = " + err);
                res.serverError();
              } else {
                res.view('dashboard/taskDetails', {
                  user: user,
                  classroom: className,
                  task: taskName,
                  currentPage: 'specificTask',
                });
              }
            });
          }
        });
      }
    });
  },
};