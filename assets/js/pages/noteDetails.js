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
    // var description = document.getElementById('editDescription').innerHTML;
    var description = document.getElementById("editDescription").value;
    // var note = document.getElementById('newNote').innerHTML;
    // console.log(description);
    // alert(description);
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
            swal("Uh-Oh", "There was an error updating the note. 1", "error");
            console.log(data.message);
          }
        },
        error: function(data) {
          swal("Uh-Oh", "There was an error updating the note. 2", "error");
          console.log(data.message);
        }
      });
    } else {
      swal("Uh-Oh", "Please make your changes above.", "error");
    }
  });

  $("#deleteNoteButton").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var nid = document.getElementById('noteId').innerHTML;

    var postObj = {
      classId: cid,
      noteId: nid
    };

    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this note!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2cc36b",
      showLoaderOnConfirm: true,
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false,
    }, function() {
      $.ajax({
        type: 'POST',
        url: '/note/remove',
        data: postObj,
        success: function(data) {
          if (data.success) {
            swal({
              title: "Deleted!",
              text: "The note has been deleted.",
              type: "success",
              confirmButtonText: "OK",
            }, function() {
              var url = "/class/" + data.urlName + "/notes";
              window.location.href = url;
            });
          } else {
            swal("Uh-oh!", "There was an error deleting the class.", "error");
          }
        },
        error: function(data) {
          swal("Uh-oh!", "There was an error deleting the class.", "error");
        }
      });
    });
  });
});