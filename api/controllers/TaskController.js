/**
 * TaskController
 *
 * @description :: Server-side logic for managing tasks
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
        // Lookup class for task to be assigned to.
        console.log("POSTINFO " + post.name);
        console.log("CLASSID " + post.classId);
        Classroom.findOne({
          cid: post.classId
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            console.log("Error Code 00006.0");
            res.serverError();
          } else {
            var tid = Math.floor(Math.random() * 1000000000000000000000);
            var name = post.name;
            var duedate = post.duedate;
            var note = post.note;

            var taskData = {
              tid: tid,
              name: name,
              dueDate: duedate,
              note: note,
              status: false
            };

            // Create the task
            Task.create(taskData).exec(function(err, newTask) {
              // Handle errors creating the new task
              if (err || newTask == undefined) {
                console.log("There was an error creating the new task.");
                console.log("Error = " + err);
                console.log("Error Code 00009.0");
                res.serverError();
              } else {
                if (className.tasks == null || className.tasks == undefined) {
                  className.tasks = [];
                }
                if (className.incompletedTasks == null || className.incompletedTasks == undefined) {
                  className.incompletedTasks = [];
                }
                var taskCount = className.tasks.length;
                className.tasks[taskCount] = newTask.tid;
                className.incompletedTasks[className.incompletedTasks.length] = newTask.tid;

                // Save the class
                className.save(function(err) {
                  if (err) {
                    console.log("There was an error saving the classroom after creating a new task");
                    console.log("Error = " + err);
                    console.log("Error Code 00010.0");
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

  status: function(req, res) {
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
            console.log("There was an error looking up the classroom.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            Task.findOne({
              tid: post.taskId
            }).exec(function(err, taskName) {
              if (err || taskName == undefined) {
                console.log("There was an error looking up the task.");
                console.log("Error = " + err);
                res.serverError();
              } else {
                taskName.status = post.status;
                taskName.save(function(err) {
                  if (err) {
                    console.log("There was an error saving the task.");
                    console.log("Error = " + err);
                    res.serverError();
                  } else {
                    // Remove task from class lists
                    var status = post.status;
                    console.log("STATUS: " + status);
                    // Task is complete
                    if (status == "true") {
                      // Remove from incomplete list
                      var index = className.incompletedTasks.indexOf(taskName.tid);
                      if (index > -1) {
                        className.incompletedTasks.splice(index, 1);
                      }
                      // Add to completed list
                      className.completedTasks.push(taskName.tid);
                      console.log("Completed Tasks: " + className.completedTasks);
                    }
                    // Task is no longer complete
                    if (status == "false") {
                      // Remove from complete list
                      var index = className.completedTasks.indexOf(taskName.tid);
                      if (index > -1) {
                        className.completedTasks.splice(index, 1);
                      }
                      // Add to incomplete list
                      className.incompletedTasks.push(taskName.tid);
                      console.log("Incompleted Tasks: " + className.incompletedTasks);
                    }
                    var returnUrl = "/class/" + className.urlName + "/tasks";
                    className.save(function(err) {
                      if (err) {
                        console.log("There was an error saving the classroom after altering the task arrays.");
                        console.log("Error = " + err);
                        res.serverError();
                      } else {
                        res.send({
                          success: true,
                          returnUrl: returnUrl
                        });
                      }
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
        Class.findOne({
          cid: post.classId
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            console.log("Error Code 00006.0");
            res.serverError();
          } else {
            var tid = post.tid;
            var name = post.name;
            var duedate = post.duedate;
            Task.findOne({
              tid: tid
            }).exec(function(err, task) {
              if (err || task == undefined) {
                console.log("There was an error looking up the task.");
                console.log("Error = " + err);
                console.log("Error Code 0012.0");
                res.serverError();
              } else {
                if (name == undefined && duedate == undefined) {
                  res.send({
                    success: false,
                    message: "No data sent"
                  });
                } else if (name != undefined && duedate == undefined) {
                  task.name == name;
                } else if (name == undefined && duedate != undefined) {
                  task.duedate = duedate;
                } else {
                  console.log("Something went wrong above.");
                }
                task.save(function(err) {
                  if (err) {
                    console.log("There was an error saving the task after updates were made.");
                    console.log("Error = " + err);
                    console.log("Error Code 0013.0");
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

  remove: function(req, res) {
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
            console.log("There was an error looking up the classroom.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            // Destroy the task
            Task.findOne({
              tid: post.taskId
            }).exec(function(err, taskName) {
              if (err || taskName == undefined) {
                console.log("There was an error looking up the task.");
                console.log("Error = " + err);
                res.serverError();
              } else {
                var status = taskName.status;
                if (status == true) {
                  var index = className.completedTasks.indexOf(post.taskId);
                  if (index > -1) {
                    className.completedTasks.splice(index, 1);
                  }
                } else {
                  var index = className.incompletedTasks.indexOf(post.taskId);
                  if (index > -1) {
                    className.incompletedTasks.splice(index, 1);
                  }
                }
                Task.destroy({
                  tid: post.taskId
                }).exec(function(err) {
                  if (err) {
                    console.log("There was an error deleting the task.");
                    console.log("Error = " + err);
                    res.serverError();
                  } else {
                    var index = className.tasks.indexOf(post.taskId);
                    if (index > -1) {
                      className.tasks.splice(index, 1);
                    }
                    className.save(function(err) {
                      if (err) {
                        console.log("There was an error saving the classroom.");
                        console.log("Error = " + err);
                        res.serverError();
                      } else {
                        var url = "/class/" + className.urlName + "/tasks";
                        res.send({
                          success: true,
                          url: url,
                        });
                      }
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
        // var cid = post.classId;
        Classroom.findOne({
          cid: cid
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            res.serverError();
          } else {
            var taskIds = className.tasks;
            // console.log("CLASS IDS");
            // console.log(taskIds);
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
                  Task.findOne({
                    tid: taskIds[i]
                  }).exec(function(err, taskName) {
                    if (err || taskName == undefined) {
                      console.log("There was an error lookign up the task.");
                      res.serverError();
                    } else {
                      // console.log(taskName);
                      finalTaskList.push(taskName);
                      // console.log("FINAL: " + finalTaskList.length);
                      // console.log("TID LIST: " + taskIds.length);
                      if (finalTaskList.length == taskIds.length) {
                        var incompletedTasksList = className.incompletedTasks;
                        var incompleteTasks = [];
                        for (var i = 0; i < incompletedTasksList.length; i++) {
                          var index = taskIds.indexOf(incompletedTasksList[i]);
                          incompleteTasks[i] = finalTaskList[index];
                        }
                        if (incompleteTasks.length == incompletedTasksList.length) {
                          finalTaskList.sort(dynamicSort("dueDate"));
                          incompleteTasks.sort(dynamicSort("dueDate"));
                          res.view('dashboard/tasks', {
                            user: user,
                            classroom: className,
                            tasks: finalTaskList,
                            incompletedTasks: incompleteTasks,
                            currentPage: 'tasks',
                          });
                        }
                      }
                    }
                    // // Reorder the task list based on date
                    // console.log("SORT");
                    // finalTaskList.sort(dynamicSort("dueDate"));
                    // incompleteTasks.sort(dynamicSort("dueDate"));
                    // console.log("SORTED FINALTASKLIST");
                    // console.log(finalTaskList);
                    //
                    // console.log("SORTED INCOMPLETETASK");
                    // console.log(incompleteTasks);
                  });
                }
              }
            } else {
              // finalTaskList.sort(dynamicSort("dueDate"));
              // console.log("SORTED FINALTASKLIST");
              // console.log(finalTaskList);
              // incompleteTasks.sort(dynamicSort("dueDate"));
              // console.log("SORTED INCOMPLETETASK");
              // console.log(incompleteTasks);
              res.view('dashboard/tasks', {
                user: user,
                classroom: className,
                tasks: finalTaskList,
                incompletedTasks: null,
                currentPage: 'tasks'
              });
            }
          }
        });
      }
    });
  },


};