$(document).ready(function() {
   $("#submit").click(function() {
      var firstName = $("#firstName").val();
      var lastName = $("#lastName").val();
      var email = $("#email").val();
      var password = $("#password").val();
      var passwordConf = $("#passwordConfirmation").val();

      function submitRequestForAccountCreation(profile) {
         $.ajax({
            type: 'POST',
            url: '/signup',
            data: profile,
            success: function(data) {
               console.log(data);
               if(data.success == true) {
                  window.location.href = "/dashboard";
               }
               else {
                  swal("Uh-oh!", "Looks like there was some sort of error creating your account.", "error");
               }
            },
            error: function(data) {
               console.log(data);
               swal("Uh-oh!", "Looks like there was some sort of error creating your account.", "error");
            }
         });
      }

      if(password != passwordConf) {
         swal("Password Mismatch", "Looks like the two passwords you typed don't match.", "error");
      }
      else {
         if(password == "password") {
            swal("Seriously?", "Having your password as 'password' is not security... You can do better than that...", "warning");
         }
         else if(password.length <= 7) {
            swal({
               title: "You're password is ridiculously insecure.",
               text: "Are you sure you want to proceed using that short of a password?",
               type: 'warning',
               showCancelButton: true,
               confirmButtonText: "Yes, I don't care about security.",
               closeOnConfirm: true
            }, function() {
               swal("To hell with security!", "Creating your easily hackable account now.", "success");

               var accountDetails = {
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  password: password
               };

               submitRequestForAccountCreation(accountDetails);
            });
         }
         else {
            var accountData = {
               firstName: firstName,
               lastName: lastName,
               email: email,
               password: password
            };

            submitRequestForAccountCreation(accountData);
         }
      }
   });
});
