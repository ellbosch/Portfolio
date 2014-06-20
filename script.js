$(document).ready(function() {
	var didScroll = false;

	// bootstrap scroll-spy
	$("body").scrollspy({ target: "#navbar" });
	$('[data-spy="scroll"]').each(function () {
  		var $spy = $(this).scrollspy('refresh');
	});
	$('#navbar').on('activate.bs.scrollspy', function () {
		$(".nav li a").css('color', '#EEEEEE');
  		var currentItem = $(".nav li.active > a").text();

		$(".nav li.active > a").css('color', 'red');
	});

	// make sure all nav elements are deactive
	$(window).scroll(function() {
		didScroll = true;
		// scroll to next page if at beginning
		// if ($(document).scrollTop() < ($("#cover-page").height() / 2)) {
		// 	$('html, body').animate({
		// 		scrollTop: $("#about").offset().top
		// 	}, 1000);
		// }

		// if ($(document).scrollTop() < 100) {
  // 			$("#aboutTab a").css('color', '#EEEEEE');
  // 		} else {
  // 			$("#aboutTab.active > a").css('color', 'red');
  // 		}
	});

	// set delay to performing actions involving a scroll event
	setInterval(function() {
		var posTop = $(document).scrollTop();

		if (didScroll) {
			didScroll = false;

			// animate to about div
			if (posTop < ($("#cover-page").height() / 4)) {
				$('html, body').animate({
					scrollTop: $("#about").offset().top
				}, 1000).delay(800);
			// animate to top
			} else if (posTop < $("#cover-page").height() * 0.75 &&
				posTop > ($("cover-page").height() / 4)) {
				$('html, body').animate({
					scrollTop: 0
				}, 1000);
			}

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

	// parallelx animations, dawg
	$.stellar();

	// fix position of scroll div when window resizes
	$(window).resize(function() {
		$("#scroll-button").css('left','50%');
		$("#scroll-button").css('right','50%');
	});

});