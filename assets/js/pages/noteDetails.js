$(document).ready(function() {

  $("#saveNote").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var nid = document.getElementById('noteId').innerHTML;
    var contents = editor.getValue();
    var postObj = {
      classId: cid,
      noteId: nid,
      contents: contents
    };

    $.ajax({
      type: 'POST',
      url: '/note/updateBody',
      data: postObj,
      success: function(data) {
        if (data.success == true) {
          swal("Success!", "The note has successfully been updated.", "success");
          swal({
            title: "Success!",
            type: "success",
            text: "The note has successfully been updated.",
            showCancelButton: false,
          }, function() {
            location.reload();
          });
        } else {
          swal("Uh-oh!", "There was an error updating the note.", "error");
        }
      },
      error: function(data) {
        swal("Uh-oh!", "There was an error updating the note.", "error");
      }
    });
  });

  $("#editNoteButton").click(function() {
    var name = $("#editName").val();
    try {
      var description = document.getElementById('noteDescription').innerHTML;
      console.log(description);
    } catch (e) {
      console.log(e);
    }
    var cid = document.getElementById('classId').innerHTML;
    var nid = document.getElementById('noteId').innerHTML;

    var postObj = {
      classId: cid,
      noteId: nid
    };

    var updated = false;
    if (name !== undefined && name !== null && name !== "") {
      postObj.name = name;
      updated = true;
    }
    if (description !== undefined && description !== null && description !== "") {
      postObj.description = description;
      updated = true;
    }

    if (updated == true) {
      $.ajax({
        type: 'POST',
        url: '/note/update',
        data: postObj,
        success: function(data) {
          if (data.success == true) {
            swal({
              type: "success",
              title: "Success",
              text: "The note has successfully been updated",
              showCancelButton: false,
            }, function() {
              location.reload();
            });
          } else {
            swal("Uh-Oh", "There was an error updating the note.", "error");
          }
        },
        error: function(data) {
          swal("Uh-Oh", "There was an error updating the note.", "error");
        },
      });
    } else {
      swal("Uh-Oh", "Please make your changes above.", "error");
    }
  });
});