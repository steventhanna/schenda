$(document).ready(function() {
  $("#addProjectButton").click(function() {
    // var cid = $('#classId').val();
    var name = $("#newProjectName").val();
    var note = document.getElementById('newDescription').innerHTML;
    var cid = document.getElementById('classId').innerHTML;
    // var duedate = document.getElementById('date').innerHTML;
    var duedate = $("#date").val();
    if (name == undefined) {
      swal("Uh-oh", "Please include a project name.", "error");
    } else {
      var postObj = {
        classId: cid,
        name: name,
        description: note,
        duedate: duedate
      };
      $.ajax({
        type: 'POST',
        url: '/project/new',
        data: postObj,
        success: function(data) {
          console.log(data);
          if (data.success == true) {
            location.reload();
          } else {
            swal("Uh-oh! - ", "There was an error creating a project.", "error");

          }
        },
        error: function(data) {
          console.log(data);
          swal("Uh-oh!", "There was an error creating a project.", "error");
        }
      });
    }
  });
});