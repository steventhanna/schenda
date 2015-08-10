/**
 * NoteController
 *
 * @description :: Server-side logic for managing notes
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
        // Lookup class
        Classroom.findOne({
          cid: post.classId
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            console.log("Error Code 00006.0");
            res.serverError();
          } else {
            var name = post.name;
            var nid = Math.floor(Math.random() * 1000000000000000000000);
            var body = post.body;
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
              dd = '0' + dd
            }
            if (mm < 10) {
              mm = '0' + mm
            }
            today = mm + '/' + dd + '/' + yyyy;
            var date = today;
            var noteData = {
              name: name,
              nid: nid,
              body: body,
              date: today
            };

            Note.create(noteData).exec(function(err, newNote) {
              // Handle errors creating the new note
              if (err || newNote == undefined) {
                console.log("There was an error creating the new note.");
                console.log("Error = " + err);
                console.log("Error Code 0010.0");
                res.serverError();
              } else {
                if (className.notes == null || className.notes == undefined) {
                  className.notes = [];
                }
                var noteCount = className.notes.length;
                className.notes[noteCount] = newNote.tid;

                // Save the class
                className.save(function(err) {
                  if (err) {
                    console.log("There was an error saving the classroom after creating a new note");
                    console.log("Error = " + err);
                    console.log("Error Code 0013.0");
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
        // Remove the note
        Classroom.findOne({
          cid: post.classId
        }).exec(function(err, className) {
          if (err || className == undefined) {
            console.log("There was an error looking up the class.");
            console.log("Error = " + err);
            console.log("Error Code 00006.0");
            res.serverError();
          } else {
            // Find location of note in array
            var id = post.noteId;
            var index = user.classes.notes.indexOf(id);
            // Update the user
            if (index > -1) {
              user.classes.notes.splice(index, 1);
            }
            // Save the user
            user.save(function(err) {
              if (err) {
                console.log("There was an error saving the user after updating the note array.");
                console.log("Error = " + err);
                console.log("Error Code 0014.0");
                res.send({
                  success: false,
                  message: err
                });
              } else {
                // Destroy the note
                Note.destroy({
                  id: post.noteId
                }).exec(function(err) {
                  if (err) {
                    console.log("The note could not be destroyed from the database.")
                    console.log("Error = " + err);
                    console.log("Error Code 0015.0");
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

};