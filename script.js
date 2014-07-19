$(document).ready(function() {
	var ctx;
	var ctx_height = 0;
	var ctx_width = 0;

	// canvas
	var canvas = $("#clouds");
	if (canvas[0].getContext) {
		// browser supports canvas
		ctx = canvas[0].getContext('2d');
		ctx_height = canvas.height();
		ctx_width = canvas.width();
		drawClouds(ctx, 1.0);
	} else {
		// browser does not support context, and we hide parent div
		$("#transparency").css('display', 'none');
	}

	function drawClouds(ctx) {
		ctx.clearRect(0, 0, ctx_width, ctx_height); // clear canvas

		// draw background
		ctx.fillStyle = "rgb(140, 195, 242)";
		ctx.fillRect(0, 0, ctx_width, ctx_height);

		// made multiple layers of clouds
		for (var i = 0; i <= 500; i += 20) {
			var yStart = ctx_height - i;		// y start of clouds
			var xStart = -200;
			var x = xStart;
			ctx.beginPath();
			ctx.moveTo(x, ctx_height);
		    ctx.lineTo(x, yStart);

		    // create random coordinates for clouds using quadratic curves
		    // until x coordinate reaches past canvas width
		    while (x < ctx_width + 200) {
		    	// change in x between 60 and 120
		    	var x_rand = Math.ceil(Math.random() * 60) + 100;
		    	// change in y bewtween 0 and 10
		    	var y_rand = Math.ceil(Math.random() * 40) + yStart;
		    	// curve height between 15 and 25
		    	var curveHeight = Math.ceil(Math.random() * 10) + (yStart - 15);
		    	var x_new = x + x_rand;
			    ctx.quadraticCurveTo(x + (x_rand/2), curveHeight, x_new, y_rand);
			    x = x_new;
		    }
		    // fill rest of shape
		    ctx.lineTo(x, ctx_height);
		    ctx.lineTo(xStart, ctx_height);
		    ctx.fillStyle = "rgba(238, 238, 238, 0.4)";
		    //ctx.fillStyle = "rgba(142, 188, 226, " + opacityClouds + ")";
		    ctx.fill();
		}
	}
	window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
     })();


	function animateScene(ctx, opacity) {
		ctx.clearRect(0, 0, ctx_width, ctx_height); // clear canvas
		var opacityBG = 1 - opacity;
		var opacityClouds = 0.4 - opacity;

		// set opacity of background
		//ctx.fillStyle = "rgba(140, 195, 242," + opacityBG + ")";
		//ctx.fillRect(0, 0, ctx_width, ctx_height);

		// set opacity of clouds
		//ctx.translate(500,100);

		for (var i = 0; i <= 500; i += 20) {
			ctx.restore();
			ctx.fillStyle = "rgba(238, 238, 238," + opacityClouds + ")";
			ctx.fill();
		}
	}

	// parallax, dawg
	//var s = skrollr.init();

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
	$(window).scroll(function(event) {
		didScroll = true;

		if ($(document).scrollTop() < 400) {
			//preventDefault(event);
		}
	});

	// set delay to performing actions involving a scroll event
	setInterval(function() {
		var posTop = $(document).scrollTop();

		if (didScroll) {
			didScroll = false;

			// add opacity to nav when off cover page
			if (posTop > $(window).height() * 3) {
				$("#navbar").css('background-color','rgba(255,255,255,0.9)');
			} else {
				$("#navbar").css('background-color','rgba(255,255,255,0)');
				// change opacity in clouds cuz we high
				var opacity = posTop / ($(window).height() * 3);
				animateScene(ctx, opacity);
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
	}, 17);
});