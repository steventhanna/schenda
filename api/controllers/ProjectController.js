/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
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
        Classroom.findOne({
          cid: post.classId
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            var pid = Math.floor(Math.random() * 1000000000000000000000);
            var name = post.name;
            var tasks = [];
            var duedate = post.duedate;
            var description = post.description;
            var projectData = {
              pid: pid,
              name: name,
              tasks: tasks,
              duedate: duedate,
              description: description
            };
            Project.create(projectData).exec(function(err, newProject) {
              if (err || newProject == undefined) {
                console.log("The project could not be created.");
                console.log("Error = " + err);
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
  },

  projects: function(req, res) {
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
        Classroom.findOne({
          cid: cid
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            // Find all projects and send to page
            if (className.projects.length == 0) {
              res.view('dashboard/projectHome', {
                user: user,
                classroom: className,
                projects: undefined
              });
            } else {
              var projectIdList = className.projects;
              var fullProjectList = [];
              if (fullProjectList.length == projectIdList.length) {
                res.view('dashboard/projectHome', {
                  user: user,
                  classroom: className,
                  projects: fullProjectList
                });
              } else {
                for (var i = 0; i < projectIdList.length; i++) {
                  if (fullProjectList.length == projectIdList.length) {
                    res.view('dashboard/projectHome', {
                      user: user,
                      classroom: className,
                      projects: fullProjectList
                    });
                  } else {
                    Project.findOne({
                      pid: projectIdList[i]
                    }).exec(function(err, projectName) {
                      if (err || projectName == undefined) {
                        console.log("The the project could not be located.");
                        console.log("Error = " + err);
                        res.serverError();
                      } else {
                        fullProjectList[i] = projectName;
                        if (fullProjectList.length == projectIdList.length) {
                          res.view('dashboard/projectHome', {
                            user: user,
                            classroom: className,
                            projects: fullProjectList
                          });
                        }
                      }
                    });
                  }
                }
              }
            }
          }
        });
      }
    });
  },

};