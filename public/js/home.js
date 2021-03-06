$(function () {
	$('#emailForm').submit(function (event) {
		event.preventDefault();

		// Validate the email
		var email = $(this).find('input[type=email]').val();
		if (!validateEmail(email)) {
			alert('Please enter a valid email address');
		} else {
			// Post the email
			$.post('/email/', $(this).serialize()).done(function () {
				console.log('successful email post');
			});

			$('.card').addClass('flipped');
		}

		event.stopPropagation();
		return false;
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
		"img/toys1.jpg",
		"img/toys2.jpg",
		"img/toys3.jpg",
		"img/toys4.jpg",
		"img/toys5.jpg",
		"img/toys6.jpg",
		"img/toys7.jpg",
		"img/toys8.jpg",
		"img/toys9.jpg"
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

		1000 * 5
	);

});