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
		$(".nav li.active > a").css('color', '#2ecc71');
	});

	// animate scrollspy
	$("#navbar ul li a[href^='#']").on('click', function(e) {
		// prevent default anchor click behavior
		e.preventDefault();

		// store hash
		var hash = this.hash;

		// animate
		$('html, body').animate({
			scrollTop: $(this.hash).offset().top
		}, 300, function(){

		   // when done, add hash to url
		   // (default click behaviour)
		   window.location.hash = hash;
	});

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

			// add opacity to nav when off cover page
			if (posTop > $("#cover-page").height()) {
				$("#navbar").css('background-color','rgba(255,255,255,0.9)');
			} else {
				$("#navbar").css('background-color','rgba(255,255,255,0)');
			}

			// activate "about" header
			if (posTop < $("#projects").height() && posTop > $("#about").height) {
				$("#aboutTab.active > a").css('color', '#2ecc71');
			}

			// animate to about div
			if (posTop > 0 && isAtTop) {
				// $('html, body').animate({
				// 	scrollTop: $("#about").offset().top
				// }, 1000);
				isAtTop = false;
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