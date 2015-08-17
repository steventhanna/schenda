$(document).ready(function() {

  $("#taskCompleteButton").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var tid = document.getElementById('taskId').innerHTML;
    var returnUrl = document.getElementById('returnURL').innerHTML;
    var postObj = {
      status: true,
      taskId: tid,
      classId: cid,
    };
    $.ajax({
      type: 'POST',
      url: '/task/status',
      data: postObj,
      success: function(data) {
        if (data.success == true) {
          window.location.href = returnUrl;
        }
      },
      error: function(data) {
        swal("Uh-Oh!", "The task could not be marked as completed.", "error");
      }
    });
  });

  $("#taskIncompleteButton").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var tid = document.getElementById('taskId').innerHTML;
    var returnUrl = document.getElementById('returnURL').innerHTML;
    var postObj = {
      status: false,
      taskId: tid,
      classId: cid,
    };
    $.ajax({
      type: 'POST',
      url: '/task/status',
      data: postObj,
      success: function(data) {
        if (data.success == true) {
          window.location.href = returnUrl;
        }
      },
      error: function(data) {
        swal("Uh-Oh!", "The task could not be marked as incomplete.", "error");
      }
    });
  });


  $("#deleteTaskButton").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var tid = document.getElementById('taskId').innerHTML;
    var returnUrl = document.getElementById('returnURL').innerHTML;
    var postObj = {
      taskId: tid,
      classId: cid,
    };
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this task!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2cc36b",
      showLoaderOnConfirm: true,
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false,
    }, function() {
      $.ajax({
        type: 'POST',
        url: '/task/remove',
        data: postObj,
        success: function(data) {
          if (data.success) {
            swal({
              title: "Deleted!",
              text: "The class has been deleted.",
              type: "success",
              confirmButtonText: "OK",
            }, function() {
              window.location.href = data.url;
            });
          } else {
            swal("Uh-oh!", "There was an error deleting the task.", "error");
          }
        },
        error: function(data) {
          swal("Uh-oh!", "There was an error deleting the task.", "error");
        }
      });
    });
  });

  $("#addTaskButton").click(function() {
    // var cid = $('#classId').val();
    var cid = document.getElementById('classId').innerHTML;
    console.log(cid);
    var name = $("#newTaskName").val();
    var notes = document.getElementById('newNote').value;
    var duedate = document.getElementById("date").innerHTML;

    if (name == " " || name == "") {
      swal("Enter Task Name", "You need to enter a task name to create a task.", "error");
    } else if (duedate == "" || duedate == " ") {
      var postObj = {
        classId: cid,
        name: name
      };
    } else if (notes !== "" || notes !== " ") {
      var postObj = {
        classId: cid,
        name: name,
        duedate: duedate,
        note: notes,
      };
    }
    // var postObj = {
    //   classId: cid,
    //   name: name,
    //   duedate: duedate
    // };
    console.log("postOBj " + postObj.duedate);
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
  });
});