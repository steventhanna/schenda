$(document).ready(function() {
	$("#submit").click(function() {
		var username = $("#email").val();
		var password = $("#password").val();

		if(username == "" || username == " ") {
			swal("Enter Email", "You need to enter an email address to login...", "error");
		}
		else if(password == "" || username == " ") {
			swal("Enter Password", "Seriously, come on, enter your password.", "error");
		}
		else {
			var postObj = {
				username: username,
				password: password
			};

			$.ajax({
				type: 'POST',
				url: '/signin',
				data: postObj,
				success: function(data) {
					console.log(data);
					if(data.success == true) {
						window.location.href = "/dashboard";
					}
					else {
						swal("Uh-oh!", "There was an error logging you into your account.", "error");
					}
				},
				error: function(data) {
					console.log(data);
					swal("Uh-oh!", "There was an error logging you into your account.", "error");
				}
			});
		}
	});
});
