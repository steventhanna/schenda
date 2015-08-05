$(document).ready(function() {
  $("submit").click(function() {
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var passwordConfirmation = ("#passwordConfirmation").val();

    // I'll handle error handling later.

    var postObj = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    console.log(postObj);

    $.ajax({
        type: 'POST',
        url: '/signup',
        data: 'postObj'
      }),
      .success(function(data) {
        alert("Success");
      }),
      .error(function(data) {
        alert("Failure");
      });
  });
});