$(document).ready(function() {

  $("#taskCompleteButton").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var tid = document.getElementById('taskId').innerHTML;
    var returnUrl = document.getElementById('returnURL').innerHTML;
    var postObj = {
      status: true,
      tid: tid,
      cid: cid,
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

  $("#deleteTaskButton").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var tid = document.getElementById('taskId').innerHTML;
    var returnUrl = document.getElementById('returnURL').innerHTML;
    var postObj = {
      tid: tid,
      cid: cid,
    };
    swal({
      type: 'warning',
      title: 'Are you sure?',
      text: 'This task can not be recovered once deleted.',
      showCancelButton: true,
      closeOnCancel: true,
      showConfirmButton: true,
      showLoaderOnConfirm: true,
    }, function() {
      $.ajax({
        type: 'POST',
        url: 'task/remove',
        data: postObj,
        success: function(data) {
          if (data.success == true) {
            swal({
              type: 'success',
              title: 'Success!',
              text: 'The task has successfully been deleted.',
              showCancelButton: false
            }, function() {
              window.location.href = data.url
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