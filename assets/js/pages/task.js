$(document).ready(function() {
  $("#seeAllTasks").click(function() {
    document.getElementById('viewAllTasks').className = "";
    document.getElementById('incompleteTasksPane').className = "hidden";
  });

  $("#showIncompleteTasks").click(function() {
    document.getElementById('viewAllTasks').className = "hidden";
    document.getElementById('incompleteTasksPane').className = "";
  });

  $("#addTaskButton").click(function() {
    // var cid = $('#classId').val();
    var name = $("#newTaskName").val();
    var note = document.getElementById('newNote').value;
    var cid = document.getElementById('classId').innerHTML;
    // var duedate = document.getElementById('date').innerHTML;
    var duedate = $("#newDate").val();
    if (name == undefined || name == "" || name == null) {
      swal("Uh-oh", "Please include a task name.", "error");
    } else {
      var postObj = {
        classId: cid,
        name: name,
        note: note,
      };
      if (duedate !== "" && duedate !== undefined && duedate !== null) {
        var array = duedate.split("-");
        var duedate = array[1] + "/" + array[2] + "/" + array[0];
        postObj.duedate = duedate;
      }
      console.log("postOBj " + postObj);
      $.ajax({
        type: 'POST',
        url: '/task/new',
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