$(document).ready(function() {
	var didScroll = false;
	var isAtTop = true;


	// bootstrap scroll-spy
	$("body").scrollspy({ target: "#navbar" });
	$('[data-spy="scroll"]').each(function () {
  		var $spy = $(this).scrollspy('refresh');
	});
	$('#navbar').on('activate.bs.scrollspy', function () {
		$(".nav li a").css('color', '#EEEEEE');
  		var currentItem = $(".nav li.active > a").text();

		$(".nav li.active > a").css('color', '#2ecc71');
	});

	// make sure all nav elements are deactive
	$(window).scroll(function() {
		didScroll = true;
	});

	// set delay to performing actions involving a scroll event
	setInterval(function() {
		var posTop = $(document).scrollTop();

		if (didScroll) {
			didScroll = false;

			// animate to about div
			if (posTop > 0 && isAtTop) {
				$('html, body').animate({
					scrollTop: $("#about").offset().top
				}, 1000).delay(1200);
				isAtTop = false;
				$("#aboutTab.active > a").css('color', '#2ecc71');
			// animate to top
			} /*else if (posTop < $("#cover-page").height() &&
				!isAtTop) {


		console.log("pos: " + posTop + "; cov-page: " + $("#cover-page").height());
				$('html, body').animate({
					scrollTop: 0
				}, 1000).delay(1200);
				isAtTop = true;
			}*/

/****************************************************
	note to self: make rubber band effect with jquery animations by
	animating window down when window doesn't scroll to certain height
*********************************************************/

			// HANDLE COLOR CHANGE WHEN ANIMATIONS HAPPEN
			if ($(document).scrollTop() < 100) {
	  			$("#aboutTab a").css('color', '#EEEEEE');
	  		}
		}
	}, 250);

	// parallex, dawg
	$.stellar();

});