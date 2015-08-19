$(document).ready(function() {

  $("#deleteTaskButton").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var tid = document.getElementById('taskId').innerHTML;
    var pid = document.getElementById('projectId').innerHTML;
    var returnUrl = document.getElementById('returnURL').innerHTML;
    var postObj = {
      projectId: pid,
      taskId: tid,
      classId: cid
    };
    swal({
      title: 'Are you sure?',
      type: 'warning',
      text: 'Once deleted, this task can not be recovered.',
      showConfirmButton: true,
      showCancelButton: true,
      closeOnConfirm: true,
      showLoaderOnConfirm: true,
    }, function() {
      $.ajax({
        type: 'POST',
        url: '/project/removeTask',
        data: postObj,
        success: function(data) {
          if (data.success == true) {
            swal({
              title: 'Success!',
              type: 'success',
              text: 'The task has been deleted.',
              showCancelButton: false,
              showConfirmButton: true
            }, function() {
              window.location.href = returnUrl;
            });
          } else {
            swal("Uh-Oh!", "There was an error deleting the task.", "error");
          }
        },
        error: function(data) {
          swal("Uh-Oh!", "There was an error deleting the task.", "error");
        },
      });
    });
  });

  $("#taskCompleteButton").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var tid = document.getElementById('taskId').innerHTML;
    var pid = document.getElementById('projectId').innerHTML;
    var returnUrl = document.getElementById('returnURL').innerHTML;
    var postObj = {
      status: true,
      projectId: pid,
      taskId: tid,
      classId: cid,
    };
    $.ajax({
      type: 'POST',
      url: '/project/taskStatus',
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

  $("#addTaskButton").click(function() {
    // var cid = $('#classId').val();
    var cid = document.getElementById('classId').innerHTML;
    console.log(cid);
    var name = $("#newTaskName").val();
    var notes = document.getElementById('newNote').value;
    // var picker = new Pikaday({
    //   field: document.getElementById('datepicker')
    // });
    // var duedate = picker.toString('DD-MM-YYYY');
    // var duedate = $("#date").val();
    var duedate = document.getElementById("date").value;

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