$(function () {
	$('#emailForm').submit(function () {
		event.preventDefault();

		// Validate the email
		var email = $(this).find('input[type=email]').val();
		if (!validateEmail(email)) {
			alert('Please enter a valid email address');
		}

		// Post the email
		$.post('/', $(this).serialize(), function () {
			console.log('hi');
		});
	});

	function onSuccess() {
		console.log('hi');
	}

	function validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\ ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA -Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
});