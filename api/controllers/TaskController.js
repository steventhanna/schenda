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

            var taskData = {
              tid: tid,
              nane: name,
              dueDate: duedate,
              status: 'incomplete'
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
                var taskCount = className.tasks.length;
                className.tasks[taskCount] = newTask.tid;

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
        // Lookup classroom
        Classroom.findOne({
          cid: post.classId
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            console.log("Error Code 00006.0");
            res.serverError();
          } else {
            var tid = post.tid;
            var statusBool = post.status;
            // If status == true, then complete.... else incomplete
            if (statusBool == true) {
              var status = 'complete';
            } else {
              var status = 'incomplete';
            }
            Task.findOne({
              tid: tid
            }).exec(function(err, task) {
              if (err || task == undefined) {
                console.log("There was an error looking up the task.");
                console.log("Error = " + err);
                console.log("Error Code 0012.0");
                res.serverError();
              }
              task.status = status;
              task.save(function(err) {
                if (err) {
                  console.log("The status on the task could not be updated");
                  console.log("Error = " + err);
                  console.log("Error Code 0011.0");
                  res.serverError();
                } else {
                  res.send({
                    success: true
                  });
                }
              });
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


}; // Deterine what has changed