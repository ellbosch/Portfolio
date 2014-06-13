$(document).ready(function() {
	var nav = $("#nav");
	var coverPageMax = $("#cover-page").height();

	$(window).scroll(function() {
		var windowTop = $(this).scrollTop();

		// cover page at top
		if (windowTop > coverPageMax) {
			nav.css("position", "fixed");
			nav.css("background-color", "rgba(255, 255, 255, 0.7)");
			nav.css("top", "0");
		// section 1 at top
		} else if (windowTop > $("#sec1").position().top) {
			// change color of sec1 div
			activateNavSec("sec1");
		} else if (windowTop > $("#sec2").position().top) {
			// change color of sec2 div
			activateNavSec("sec2");
		} else if (windowTop > $("#sec3").position().top) {
			// change color of sec3 div
			activateNavSec("sec3");
		} else {
			// make sure nav bar is not fixed if we are at top of page
			nav.css("position", "relative");
			nav.css("background-color", "#EEEEEE");
		}
	});
});

var activateNavSec = function(section) {
	console.log(section);

	var activatedColor = "black";
	var deactivatedColor = "rgba(0, 0, 0, 0.7)";

	var secArray = ["sec1", "sec2", "sec3"];
	for (var i = 0; i < secArray.length; i++) {
		if (section != secArray[i])
			$(secArray[i]).css("background-color", deactivatedColor);
		else
			$(secArray[i]).css("background-color", activatedColor);
	}
};