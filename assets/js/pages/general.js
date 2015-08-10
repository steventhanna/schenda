$(document).ready(function() {

  $("#addClassButton").click(function() {
    var className = $("#className").val();

    if (className == "" || className == " ") {
      swal("Enter Class Name", "You need to enter a Class Name.", "error");
    } else {
      var postObj = {
        name: className
      };

      $.ajax({
        type: 'POST',
        url: '/class/new',
        data: postObj,
        success: function(data) {
          console.log(data);
          if (data.success == true) {
            location.reload();
          } else {
            swal("Uh-oh!", "There was an error creating a new class.", "error");
          }
        },
        error: function(data) {
          console.log(data);
          swal("Uh-oh!", "There was an error creating a new class.", "error");
        }
      });
    }
  });
});