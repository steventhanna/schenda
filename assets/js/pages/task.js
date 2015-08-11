$(document).ready(function() {
  $("#addTaskButton").click(function() {
    // var cid = $('#classId').val();
    var cid = document.getElementById('classId').innerHTML;
    console.log(cid);
    var name = $("#newTaskName").val();
    var notes = $("newNote").val();
    var picker = new Pikaday({
      field: document.getElementById('datepicker')
    });
    var duedate = picker.toString('DD-MM-YYYY');

    if (name == " " || name == "") {
      swal("Enter Task Name", "You need to enter a task name to create a task.", "error");
    } else if (picker == "" || picker == " ") {
      var postObj = {
        classId: cid,
        name: name
      };
    } else if (note == "" || picker == " ") {
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
    console.log(postObj);
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