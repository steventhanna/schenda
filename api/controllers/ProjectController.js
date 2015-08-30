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
            var status = "incomplete";
            var projectData = {
              pid: pid,
              name: name,
              tasks: tasks,
              duedate: duedate,
              status: status,
              description: description,
              incompletedTasks: [],
              completedTasks: [],
            };
            console.log("DUEDATE" + duedate);
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
                    console.log("SORT + 1");
                    fullProjectList.sort(dynamicSort("duedate"));
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
                          console.log("SORT + 2");
                          fullProjectList.sort(dynamicSort("duedate"));
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
                      console.log("SORT + 3");
                      fullProjectList.sort(dynamicSort("duedate"));
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
                console.log("SORT + 4");
                fullProjectList.sort(dynamicSort("duedate"));
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
                // This is where the fun things happen
                var incompletedTaskList = [];
                var fullTaskList = [];
                var taskIdList = projectName.tasks;
                if (taskIdList.length !== fullTaskList.length) {
                  console.log("PASS FIRST CONDITION");
                  for (var i = 0; i < taskIdList.length; i++) {
                    if (taskIdList.length !== fullTaskList.length) {
                      console.log("PASS SECOND CONDITION");
                      Task.findOne({
                        tid: taskIdList[i]
                      }).exec(function(err, taskName) {
                        if (err || taskName == undefined) {
                          console.log("There was an error looking up the task.");
                          console.log("Error = " + err);
                          res.serverError();
                        } else {
                          console.log("PASS THIRD CONDITION");
                          fullTaskList.push(taskName);
                          if (taskName.status === "false") {
                            console.log("ADDED TO INCOMPLETE");
                            incompletedTaskList.push(taskName);
                          } else {
                            console.log("NOT ADDED TO INCOMPLETE");
                            console.log(taskName.status);
                          }
                        }
                      });
                    } else {
                      // Everything must be account for, so sort that shit
                      if (fullTaskList !== undefined && fullTaskList !== null) {
                        console.log("SORT ALL");
                        fullTaskList.sort(dynamicSort("duedate"));
                      }
                      if (incompletedTaskList !== undefined && incompletedTaskList !== null) {
                        console.log("SORT INCOMPLETE");
                        incompletedTaskList.sort(dynamicSort("duedate"));
                      }
                      console.log("VIEW");
                      res.view('dashboard/projectDetails', {
                        user: user,
                        project: projectName,
                        currentPage: 'specificProject',
                        incompletedTasks: incompletedTaskList,
                        tasks: fullTaskList
                      });
                    }
                  }
                } else {
                  if (fullTaskList !== undefined && fullTaskList !== null) {
                    fullTaskList.sort(dynamicSort("duedate"));
                  }
                  if (incompletedTaskList !== undefined && incompletedTaskList !== null) {
                    incompletedTaskList.sort(dynamicSort("duedate"));
                  }
                  console.log("VIEW 2");
                  res.view('dashboard/projectDetails', {
                    user: user,
                    project: projectName,
                    currentPage: 'specificProject',
                    incompletedTasks: incompletedTaskList,
                    tasks: fullTaskList
                  });
                }
              }
            });
          }
        });
      }
    });
  },

  // specificProject: function(req, res) {
  //   var post = req.body;
  //
  //   function dynamicSort(property) {
  //     var sortOrder = 1;
  //     if (property[0] === "-") {
  //       sortOrder = -1;
  //       property = property.substr(1);
  //     }
  //     return function(a, b) {
  //       var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
  //       return result * sortOrder;
  //     }
  //   }
  //   User.findOne({
  //     id: req.user.id
  //   }).exec(function(err, user) {
  //     if (err || user == undefined) {
  //       console.log("There was an error looking up the logged in user.");
  //       console.log("Error = " + err);
  //       console.log("Error Code 0003.0");
  //       res.serverError();
  //     } else {
  //       // Find the project
  //       var url = req.url;
  //       var array = url.split("/");
  //       var classUrl = array[2];
  //       var projectId = array[4];
  //       var index = user.classUrlNames.indexOf(classUrl);
  //       var cid = user.classes[index];
  //       Classroom.findOne({
  //         cid: cid
  //       }).exec(function(err, className) {
  //         if (err || className == undefined) {
  //           console.log("There was an error looking up the class.");
  //           console.log("Error = " + err);
  //           res.serverError();
  //         } else {
  //           Project.findOne({
  //             pid: projectId
  //           }).exec(function(err, projectName) {
  //             if (err || projectName == undefined) {
  //               console.log("There was an error looking up the project.");
  //               console.log("Error = " + err);
  //               res.serverError();
  //             } else {
  //               // Look up all the tasks
  //               var taskList = projectName.tasks;
  //               var fullTaskList = [];
  //               if (taskList.length != fullTaskList.length) {
  //                 for (var i = 0; i < taskList.length; i++) {
  //                   if (taskList.length == fullTaskList.length) {
  //                     fullTaskList.sort(dynamicSort("duedate"));
  //                     console.log(fullTaskList);
  //                     res.view('dashboard/projectDetails', {
  //                       user: user,
  //                       classroom: className,
  //                       project: projectName,
  //                       tasks: fullTaskList,
  //                       currentPage: 'specificProject'
  //                     });
  //                   } else {
  //                     Task.findOne({
  //                       tid: taskList[i]
  //                     }).exec(function(err, taskName) {
  //                       if (err || taskName == undefined) {
  //                         console.log("There was an error looking up the task name.");
  //                         console.log("Error = " + err);
  //                         res.serverError();
  //                       } else {
  //                         fullTaskList[fullTaskList.length] = taskName;
  //                         if (taskList.length == fullTaskList.length) {
  //                           fullTaskList.sort(dynamicSort("duedate"));
  //                           console.log(fullTaskList);
  //                           res.view('dashboard/projectDetails', {
  //                             user: user,
  //                             classroom: className,
  //                             project: projectName,
  //                             tasks: fullTaskList,
  //                             currentPage: 'specificProject'
  //                           });
  //                         }
  //                       }
  //                     });
  //                   }
  //                 }
  //               } else {
  //                 if (taskList.length == fullTaskList.length) {
  //                   fullTaskList.sort(dynamicSort("duedate"));
  //                   console.log(fullTaskList);
  //                   res.view('dashboard/projectDetails', {
  //                     user: user,
  //                     classroom: className,
  //                     project: projectName,
  //                     tasks: fullTaskList,
  //                     currentPage: 'specificProject'
  //                   });
  //                 }
  //               }
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // },

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
        Project.findOne({
          pid: post.projectId
        }).exec(function(err, projectName) {
          if (err || projectName == undefined) {
            console.log("There was an error looking up the project.");
            console.log("Error = " + err);
            console.log("Error Code 0003.0");
            res.serverError();
          } else {
            var name = post.name;
            var description = post.description;
            var duedate = post.duedate;
            if (name !== undefined && name !== "") {
              projectName.name = name;
            }
            if (description !== undefined && description !== "") {
              projectName.description = description;
            }
            if (duedate !== undefined && duedate !== "") {
              projectName.duedate = duedate;
            }
            projectName.save(function(err) {
              if (err) {
                console.log("There was an error saving the project.");
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

  addTask: function(req, res) {
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
            Project.findOne({
              pid: post.projectId
            }).exec(function(err, projectName) {
              if (err || projectName == undefined) {
                console.log("There was an error looking up the project.");
                console.log("Error = " + err);
                res.serverError();
              } else {
                var name = post.name;
                var note = post.note;
                var duedate = post.duedate;
                var tid = Math.floor(Math.random() * 1000000000000000000000);
                var taskData = {
                  tid: tid,
                  name: name,
                  note: note,
                  duedate: duedate,
                  status: 'incomplete',
                };
                Task.create(taskData).exec(function(err, newTask) {
                  if (err || newTask == undefined) {
                    console.log("There was an error creating the new task.");
                    console.log("Error = " + err);
                    res.serverError();
                  } else {
                    projectName.tasks[projectName.tasks.length] = newTask.tid;
                    projectName.incompletedTasks.push(newTask.tid);
                    console.log(projectName.tasks);
                    projectName.save(function(err) {
                      if (err) {
                        console.log("There was an error saving the project.");
                        console.log("Error = " + err);
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
      }
    });
  },

  specificTask: function(req, res) {
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
        var array = url.split("/");
        var classUrlName = array[2];
        var index = user.classUrlNames.indexOf(classUrlName);
        var cid = user.classes[index];
        var pid = array[4];
        var tid = array[5];
        Classroom.findOne({
          cid: cid
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            Project.findOne({
              pid: pid
            }).exec(function(err, projectName) {
              if (err || projectName == undefined) {
                console.log("There was an error looking up the project.");
                console.log("Error = " + err);
                res.serverError();
              } else {
                Task.findOne({
                  tid: tid
                }).exec(function(err, taskName) {
                  if (err || taskName == undefined) {
                    console.log("There was an error looking up the task.");
                    console.log("Error = " + err);
                    res.serverError();
                  } else {
                    res.view('dashboard/projectTaskDetails', {
                      user: user,
                      classroom: className,
                      project: projectName,
                      task: taskName,
                      currentPage: 'taskDetails'
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

  taskStatus: function(req, res) {
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
        Project.findOne({
          pid: post.projectId
        }).exec(function(err, projectName) {
          if (err || projectName == undefined) {
            console.log("There was an error looking up the project.");
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
                var status = post.status;
                // Task moves from incomplete to complete
                if (status == "true") {
                  var index = projectName.incompletedTasks.indexOf(post.taskId);
                  if (index > -1) {
                    projectName.incompletedTasks.splice(index, 1);
                  }
                  // Move tid to completed
                  // projectName.completedTasks.push(post.taskId);
                  projectName.completedTasks[projectName.completedTasks.length] = post.taskId;
                }
                // Task moves from complete to incomplete
                if (status == "false") {
                  var index = projectName.completedTasks.indexOf(post.taskId);
                  if (index > -1) {
                    projectName.completedTasks.splice(index, 1);
                  }
                  // Move tid to incomplete
                  projectName.incompletedTasks.push(post.taskId);
                }
                taskName.status = status;
                taskName.save(function(err) {
                  if (err) {
                    console.log("The task could not be saved.");
                    console.log("Error = " + err);
                    res.serverError();
                  } else {
                    projectName.save(function(err) {
                      if (err) {
                        console.log("The project could not be saved.");
                        console.log("Error = " + err);
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
      }
    });
  },

  removeTask: function(req, res) {
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
        Project.findOne({
          pid: post.projectId
        }).exec(function(err, projectName) {
          if (err || projectName == undefined) {
            console.log("There was an error looking up the project.");
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
                // Remove from main task list
                var mainIndex = projectName.tasks.indexOf(taskName.tid);
                if (mainIndex > -1) {
                  projectName.tasks.splice(mainIndex, 1);
                }
                // Remove from other list
                if (taskName.status == "true") {
                  var index = projectName.completedTasks.indexOf(taskName.tid);
                  if (index > -1) {
                    projectName.completedTasks.splice(index, 1);
                  }
                }
                if (taskName.status == "false") {
                  var index = projectName.incompletedTasks.indexOf(taskName.tid);
                  if (index > -1) {
                    projectName.incompletedTasks.splice(index, 1);
                  }
                }
                // Delete the Task
                Task.destroy({
                  tid: post.tid
                }).exec(function(err) {
                  if (err) {
                    console.log("There was an error deleting the task.");
                    console.log("Error = " + err);
                    res.serverError();
                  } else {
                    projectName.save(function(err) {
                      if (err) {
                        console.log("There was an error updating the project");
                        console.log("Error = " + err);
                        res.serverError();
                      } else {
                        Classroom.findOne({
                          cid: post.classId
                        }).exec(function(err, className) {
                          if (err || className == undefined) {
                            console.log("There was an error finding the classroom.");
                            console.log("Error = " + err);
                            res.serverError();
                          } else {
                            var returnUrl = "/class/" + className.urlName + "/projects/" + post.projectId;
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
      }
    });
  },
};