$(document).ready(function() {
	var nav = $("#nav");
	var coverPageMax = $("#cover-page").height();
	console.log(coverPageMax);

	$(window).scroll(function() {
		if ($(this).scrollTop() > coverPageMax) {
			nav.css({position: 'fixed', top: 0});
		} else{
			nav.css({position: 'relative'});
		}
	});
});