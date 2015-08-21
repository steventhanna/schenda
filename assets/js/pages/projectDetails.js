$(document).ready(function() {

  $("#updateProject").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var pid = document.getElementById('projectId').innerHTML;
    var postObj = {
      classId: cid,
      projectId: pid,
    };
    var name = $("#projectName").val();
    var description = document.getElementById('projectDescription').innerHTML;
    var duedate = $("#projectDate").val();

    if (name !== undefined && name !== "") {
      postObj.name = name;
    }
    if (description !== undefined && description !== "") {
      postObj.description = description;
    }
    if (duedate !== undefined && duedate !== "") {
      var array = duedate.split("-");
      var duedate = array[1] + "/" + array[2] + "/" + array[0];
      postObj.duedate = duedate;
    }
    $.ajax({
      type: 'POST',
      url: '/project/update',
      data: postObj,
      success: function(data) {
        if (data.success == true) {
          swal("Success!", "The project has been updated.", "success");
        } else {
          swal("Uh-Oh!", "There was an error updating the proejct.", "error");
        }
      },
      error: function(data) {
        swal("Uh-Oh!", "There was an error updating the proejct.", "error");
      },
    });
  });

  $("#removeProject").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var pid = document.getElementById('projectId').innerHTML;
    var postObj = {
      classId: cid,
      projectId: pid,
    };
    swal({
      type: 'warning',
      title: 'Are you sure?',
      text: 'If you delete this project, it can not be recovered.',
      showCancelButton: true,
      closeOnCancel: true,
      showLoaderOnConfirm: true,
      confirmButtonText: "Yes, delete it!",
    }, function() {
      $.ajax({
        type: 'POST',
        url: '/project/remove',
        data: postObj,
        success: function(data) {
          if (data.success == true) {
            window.location.href = data.url;
            // swal({
            //   typ: 'success',
            //   title: 'Success',
            //   text: 'The project has successfully been deleted.',
            //   showCancelButton: false,
            // }, function() {
            //   window.location.href = data.url;
            // });
          } else {
            swal("Uh-Oh!", "There was an error deleting the project.", "erro");
          }
        },
        error: function(data) {
          swal("Uh-Oh!", "There was an error deleting the project.", "erro");
        }
      });
    });
  });

  $("#addTaskButton").click(function() {
    // var cid = $('#classId').val();
    var name = $("#newTaskName").val();
    var note = document.getElementById('newNote').value;
    var cid = document.getElementById('classId').innerHTML;
    var pid = document.getElementById('projectId').innerHTML;
    // var duedate = document.getElementById('date').innerHTML;
    var date = $("#newTaskDate").val();
    if (name == undefined) {
      swal("Uh-oh", "Please include a task name.", "error");
    } else {

      var postObj = {
        classId: cid,
        projectId: pid,
        name: name,
        note: note,
      };
      if (date !== undefined && date !== null && date !== "") {
        var array = date.split("-");
        var duedate = array[1] + "/" + array[2] + "/" + array[0];
        postObj.duedate = duedate;
      }
      console.log("postOBj " + postObj.duedate);
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