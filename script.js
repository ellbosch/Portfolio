//$(document).ready(function() {
	var nav = $("#nav");
	var coverPageMax = $("#cover-page").height + nav.height;
	console.log(coverPageMax);

	$(window).scroll(function() {
		if ($(this).scrollTop() > coverPageMax) {
			nav.position("fixed");
		}
	});
});

// https://netbeans.org/kb/docs/webclient/html5-js-support.html