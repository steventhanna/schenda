$(document).ready(function() {

  $("#removeProject").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var pid = document.getElementById('projectId').innerHTML;
    var postObj = {
      classId: cid,
      projectId: pid,
    };
    $.ajax({
      type: 'POST',
      url: '/project/remove',
      data: postObj,
      success: function(data) {
        if (data.success == true) {
          swal({
            type: 'success',
            title: 'Success',
            text: 'The project has successfully been deleted.',
            showCancelButton: false,
          }, function() {
            window.location.href = data.url;
          });
        } else {
          swal("Uh-Oh!", "There was an error deleting the project.", "erro");
        }
      }
    });
  });

  $("#addTaskButton").click(function() {
    // var cid = $('#classId').val();
    var name = $("#newTaskName").val();
    var note = document.getElementById('newNote').innerHTML;
    var cid = document.getElementById('classId').innerHTML;
    var pid = document.getElementById('projectId').innerHTML;
    // var duedate = document.getElementById('date').innerHTML;
    var duedate = $("#date").val();
    if (name == undefined) {
      swal("Uh-oh", "Please include a task name.", "error");
    } else {
      var postObj = {
        classId: cid,
        projectId: pid,
        name: name,
        note: note,
        duedate: duedate
      };
      console.log("postOBj " + postObj.duedate);
      alert(postObj.name);
      $.ajax({
        type: 'POST',
        url: '/project/addTask',
        data: postObj,
        success: function(data) {
          console.log(data);
          if (data.success == true) {
            location.reload();
          } else {
            swal("Uh-oh! - ", "There was an error creating a task.", "error");

          }
        },
        error: function(data) {
          console.log(data);
          swal("Uh-oh!", "There was an error creating a task.", "error");
        }
      });
    }
  });
});