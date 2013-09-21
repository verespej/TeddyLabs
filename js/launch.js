function url(str) {
	return "url(" + str + ")";
}

window.onload = function() {
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

			var body = document.getElementsByTagName("body")[0];
			body.style.backgroundImage = url(backgrounds[index]);
		},

		//1000 * 60
		1000 * 2
	);
};