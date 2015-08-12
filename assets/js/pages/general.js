$(document).ready(function() {

  $("#addClassButton").click(function() {
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


  //   $("#addClassButton").click(function() {
  //     var className = $("#className").val();
  //
  //     if (className == "" || className == " ") {
  //       swal("Enter Class Name", "You need to enter a Class Name.", "error");
  //     } else {
  //       var postObj = {
  //         name: className
  //       };
  //
  //       $.ajax({
  //         type: 'POST',
  //         url: '/class/new',
  //         data: postObj,
  //         success: function(data) {
  //           console.log(data);
  //           if (data.success == true) {
  //             location.reload();
  //           } else {
  //             swal("Uh-oh!", "There was an error creating a new class.", "error");
  //           }
  //         },
  //         error: function(data) {
  //           console.log(data);
  //           swal("Uh-oh!", "There was an error creating a new class.", "error");
  //         }
  //       });
  //     }
  //   });
});