$(document).ready(function() {

  $("#addClassButton").click(function() {
    console.log("TRIGGER");
    swal({
      title: "Add Class",
      // text: "",
      type: "input",
      showCancelButton: true,
      showConfirmButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Class Name"
    }, function(inputValue) {
      if (inputValue === false) {
        inputValue = false;
        return false;
      }
      if (inputValue === "") {
        swal.showInputError("Please give a class name.");
        return false
      }

      if (inputValue != false) {
        var postObj = {
          name: inputValue
        };
        $.ajax({
          type: 'POST',
          url: '/class/new',
          data: postObj,
          success: function(data) {
            if (data.success) {
              swal({
                title: "Success!",
                text: "The class has been created.",
                showConfirmButton: true,
                showCancelButton: false,
                type: "success",
              }, function() {
                location.reload();
              });
            }
          },
        });
      }
    });
  });
});