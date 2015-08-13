$(document).ready(function() {
  $("#addNoteButton").click(function() {
    // var cid = $('#classId').val();
    var name = $("#newNoteName").val();
    var description = document.getElementById('newNoteDescription').value;
    var cid = document.getElementById('cid').innerHTML;

    if (name == undefined) {
      swal("Uh-oh", "Please include a note name.", "error");
    } else {
      var postObj = {
        classId: cid,
        name: name,
        description: description,
      };
      $.ajax({
        type: 'POST',
        url: '/note/new',
        data: postObj,
        success: function(data) {
          console.log(data);
          if (data.success == true) {
            location.reload();
          } else {
            swal("Uh-oh! - ", "There was an error creating a new note.", "error");
          }
        },
        error: function(data) {
          console.log(data);
          swal("Uh-oh!", "There was an error creating a new note.", "error");
        }
      });
    }
  });
});