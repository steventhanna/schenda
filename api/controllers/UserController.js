/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require("async");

module.exports = {

  overview: function(req, res, next) {
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
            // console.log("1. ClassId: " + classIds.length);
            // console.log("1. FinalClassList: " + finalClassList.length);
            if (finalClassList.length == classIds.length) {
              // Send info to page
              res.view('dashboard/overview', {
                user: user,
                classes: finalClassList
              });
            } else {
              // console.log("FINDING CLASS");
              Classroom.findOne({
                cid: classIds[i]
              }).exec(function(err, className) {
                if (err || className == undefined) {
                  console.log("There was an error looking up the class in the for loop.");
                  res.serverError();
                } else {
                  // console.log("ADDING CLASS");
                  // console.log(className);
                  finalClassList.push(className);
                  // console.log("ADDED CLASS");
                  // console.log("2. ClassId: " + classIds.length);
                  // console.log("2. FinalClassList: " + finalClassList.length);
                  // Put another if here?
                  // Why not
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
        var url = req.url;
        // var classnameEncoded = (url.substring('/class/'.length));

        var arrayString = url.split("/");
        var classroom = arrayString[2];

        // console.log("CLASSNAMEENCODED: " + classnameEncoded);
        // var classroom = (decodeURI(classnameEncoded));
        // console.log("CLASSROOMDECODED: " + classroom);
        var id = user.classUrlNames.indexOf(classroom);
        var taskList = [];
        Classroom.findOne({
          cid: user.classes[id]
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            // Get the tasks
            console.log("1" + className.tasks);
            // console.log("2" + taskIdList);
            if (className.tasks !== undefined && className.tasks.length > 0) {
              console.log("INSIDE IF");
              for (var i = 0; i < className.tasks.length; i++) {

                if (className.tasks.length == taskList.length) {
                  console.log("SENDING TO PAGE");
                  res.view('dashboard/tasks', {
                    user: user,
                    classroom: className,
                    currentPage: 'tasks',
                    tasks: taskList
                  });
                  console.log("SENT TO PAGE");
                } else {
                  console.log("LOOKING UP TASKS");
                  Task.findOne({
                    tid: className.tasks[i]
                  }).exec(function(err, taskName) {
                    if (err || taskName == undefined) {
                      console.log("There was an error looking up the task.");
                      res.serverError();
                    } else {
                      console.log("ADDING TASKS");
                      taskList[taskList.length] = taskName;
                      if (className.tasks.length == taskList.length) {
                        console.log("SENDING TO PAGE");
                        res.view('dashboard/tasks', {
                          user: user,
                          classroom: className,
                          currentPage: 'tasks',
                          tasks: taskList
                        });
                      }
                    }
                  });
                  if (className.tasks.length == taskList.length) {
                    console.log("SENDING TO PAGE");
                    res.view('dashboard/tasks', {
                      user: user,
                      classroom: className,
                      currentPage: 'tasks',
                      tasks: taskList
                    });
                  }
                  console.log("CLASSNAME " + className.tasks.length);
                  console.log("TASKLIST " + taskList.length);
                }
              }
            } else {
              res.view('dashboard/tasks', {
                user: user,
                classroom: className,
                tasks: taskList,
                currentPage: 'tasks'
              });
            }
          }
        });
      }
    });
  },
};