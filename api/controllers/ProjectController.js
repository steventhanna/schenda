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
                className.projects[className.projects.length] = newProject.pid;
                className.save(function(err) {
                  if (err) {
                    console.log("There was an error saving the classroom.");
                    res.serverError();
                  } else {
                    console.log("THE PROJECT WAS CREATED.");
                    console.log(newProject);
                    res.send({
                      success: true
                    });
                  }
                })
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
        // Get the class id
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
            // Gather all of the projects
            if (className.projects.length > 0) {
              var projectIdList = className.projects;
              var fullProjectList = [];
              var counter = 0;
              if (fullProjectList.length < projectIdList.length) {
                for (var i = 0; i < projectIdList.length; i++) {
                  if (fullProjectList.length == projectIdList.length) {
                    res.view('dashboard/project', {
                      user: user,
                      currentPage: 'project',
                      classroom: className,
                      projects: fullProjectList
                    });
                  } else {
                    Project.findOne({
                      pid: projectIdList[i]
                    }).exec(function(err, projectName) {
                      if (err || projectName == undefined) {
                        console.log("There was an error looking up the project.");
                        console.log("Error = " + err);
                        res.serverError();
                      } else {
                        fullProjectList[fullProjectList.length] = projectName;
                        if (fullProjectList.length == projectIdList.length) {
                          res.view('dashboard/project', {
                            user: user,
                            currentPage: 'project',
                            classroom: className,
                            projects: fullProjectList
                          });
                        }
                      }
                    });
                    if (fullProjectList.length == projectIdList.length) {
                      res.view('dashboard/project', {
                        user: user,
                        currentPage: 'project',
                        classroom: className,
                        projects: fullProjectList
                      });
                    }
                  }
                }
              } else {
                res.view('dashboard/project', {
                  user: user,
                  currentPage: 'project',
                  classroom: className,
                  projects: fullProjectList
                });
              }
            } else {
              console.log("NO PROJECTS");
              res.view('dashboard/project', {
                user: user,
                currentPage: 'project',
                classroom: className,
                projects: undefined
              });
            }
          }
        });
      }
    });
  },

  specificProject: function(req, res) {
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
        // Find the project
        var url = req.url;
        var array = url.split("/");
        var classUrl = array[2];
        var projectId = array[4];
        var index = user.classUrlNames.indexOf(classUrl);
        var cid = user.classes[index];
        Classroom.findOne({
          cid: cid
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            Project.findOne({
              pid: projectId
            }).exec(function(err, projectName) {
              if (err || projectName == undefined) {
                console.log("There was an error looking up the project.");
                console.log("Error = " + err);
                res.serverError();
              } else {
                res.view('dashboard/projectDetails', {
                  user: user,
                  classroom: className,
                  project: projectName,
                  tasks: projectName.tasks,
                  currentPage: 'specificProject'
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
    var url = req.url;
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
            Project.findOne({
              pid: post.projectId
            }).exec(function(err, projectName) {
              if (err || projectName == undefined) {
                console.log("There was an error looking up the project.");
                console.log("Error = " + err);
                res.serverError();
              } else {
                // Delete the project
                // remove from classroom
                Project.destroy({
                  pid: post.projectId
                }).exec(function(err) {
                  if (err) {
                    console.log("There was an error deleting the project");
                    console.log("Error = " + err);
                    res.serverError();
                  } else {
                    var index = className.projects.indexOf(post.projectId);
                    if (index > -1) {
                      className.projects.splice(index, 1);
                    }
                    className.save(function(err) {
                      if (err) {
                        console.log("There was an error saving the classroom.");
                        console.log("Error = " + err);
                        res.serverError();
                      } else {
                        res.send({
                          success: true,
                          url: '/class/' + className.urlName + '/projects'
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
};