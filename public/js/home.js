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


	// Cycle backgrounds
	function url(str) {
		return "url(" + str + ")";
	}
	
	var backgrounds = [
		"css/Images/toys1.jpg",
		"css/Images/toys2.jpg",
		"css/Images/toys3.jpg",
		"css/Images/toys4.jpg"
	];

	for (var i = 0; i < backgrounds.length; i++) {
		var image = new Image();
		image.src = backgrounds[i];
	}

	var index = 0;

	setInterval(
		function() {
			index++;
			if (index >= backgrounds.length) {
				index = 0;
			}
			$("body").css({ backgroundImage: url(backgrounds[index]) });
		},

		//1000 * 60
		1000 * 2
	);

});