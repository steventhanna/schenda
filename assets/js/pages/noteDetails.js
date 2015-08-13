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
});