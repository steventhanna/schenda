$(document).ready(function() {
  $("#deleteClassroomButton").click(function() {
    var className = document.getElementById('className').innerHTML;
    var cid = document.getElementById('classId').innerHTML;
    var postObj = {
      classId: cid,
    };
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this class!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2cc36b",
      showLoaderOnConfirm: true,
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false,
    }, function() {
      $.ajax({
        type: 'POST',
        url: '/class/remove',
        data: postObj,
        success: function(data) {
          if (data.success) {
            swal({
              title: "Deleted!",
              text: "The class has been deleted.",
              type: "success",
              confirmButtonText: "OK",
            }, function() {
              window.location.href = "/overview";
            });
          } else {
            swal("Uh-oh!", "There was an error deleting the class.", "error");
          }
        },
        error: function(data) {
          swal("Uh-oh!", "There was an error deleting the class.", "error");
        }
      });
    });
  });

  $("#editClassroomButton").click(function() {
    var cid = document.getElementById('classId').innerHTML;
    var name = $("#className").val();
    var color = $("#color").val();
    var postObj = {
      cid: cid,
    };
    if (name !== undefined && name !== null && name !== " " && name !== "") {
      postObj.name = name;
    }
    if (color !== undefined && color !== null && color !== " " && color !== "") {
      var isOk = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
      if (isOk == true) {
        postObj.color = color;
      } else {
        swal("Uh-oh!", "The color you entered is not a valid HEX color.", "error");
        return;
      }
    }

    $.ajax({
      type: 'POST',
      url: '/class/update',
      data: postObj,
      success: function(data) {
        if (data.success) {
          swal({
            title: "Success!",
            type: "success",
            text: "The class has been updated.",
            showConfirmButton: true,
            showCancelButton: false,
          }, function() {
            console.log(updatedUrl)
            if (data.updatedUrl == true) {
              window.location.href = '/class/' + data.url;
            }
            location.reload();
          });
        } else {
          swal("Uh-Oh!", "The class could not be updated.", "error");
        }
      },
      error: function(data) {
        swal("Uh-Oh!", "The class could be updated.", "error");
      }
    });
  });

  // $("#editClassroomButton").click(function() {
  //     console.log("TRIGGER 1");
  //     // var cid = $('#classId').val();
  //     var cid = document.getElementById('classId').innerHTML;
  //     console.log(cid);
  //     var name = $("#className").val();
  //     var color = $("#color").val();
  //
  //     var postObj = {
  //       cid: cid,
  //     };
  //
  //     if (name == undefined && color == undefined) {
  //       swal("Uh-oh!", "You need to enter new information in order to update the class", "error");
  //     }
  //     if (name !== " " && name !== "") {
  //       postObj.name = name;
  //     }
  //     if (color !== " " && color !== undefined) {
  //       var isOk = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
  //       if (isOk == true) {
  //         postObj.color = color;
  //       } else {
  //         swal("Uh-oh!", "The color you entered is not a valid HEX color.", "error");
  //       }
  //     }
  //     if (postObj !== undefined) {
  //       $.ajax({
  //         type: 'POST',
  //         url: '/classroom/update',
  //         data: postObj,
  //         success: function(data) {
  //           console.log(data);
  //           if (data.success == true) {
  //             location.reload();
  //           } else {
  //             swal("Uh-oh!", "There was an error updating the classroom.", "error");
  //           }
  //         },
  //         error: function(data) {
  //           console.log(data);
  //           swal("Uh-oh!", "There was an error updating the classroom.", "error");
  //         }
  //       });
  //     }
  //   });
  // });
});