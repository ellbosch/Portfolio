$(document).ready(function() {
	var stage = new Kinetic.Stage({
		container: 'clouds',
		width: 2000,
		height: 2000
	});

	var ctx_height = stage.getHeight();
	var ctx_width = stage.getWidth();
	var xStart = -200;

	// randomly generate clouds
	//for (var i = 0; i <= 500; i += 20) {
		// kineticjs: make new layer for each cloud
	var layer = new Kinetic.Layer();
	var yStart = ctx_height - 200; //- i;		// y start of clouds
	var cloudPoints = createCloudPoints(xStart);
	
	// assign points for curvatures of cloud
	function createCloudPoints(x) {
		var cloudCurvePoints = [];
	    var curve_x = x;
	    while (curve_x < ctx_width + 200) {
			// change in x between 60 and 120
			var x_rand = Math.ceil(Math.random() * 60) + 100;
			// change in y bewtween 0 and 10
			var y_rand = Math.ceil(Math.random() * 40) + yStart;
			// curve height between 15 and 25
			var curveHeight = Math.ceil(Math.random() * 10) + (yStart - 15);
			var x_new = curve_x + x_rand;
			var quadCurvePoints = {
				control_x: curve_x + (x_rand/2),
				control_y: curveHeight,
				end_x: x_new,
				end_y: y_rand
			}
			cloudCurvePoints.push(quadCurvePoints);
	    	curve_x = x_new;
		}
		return cloudCurvePoints;
	}
    
    // draw cloud
	var cloud = new Kinetic.Shape({
		x: xStart,
		fill: "rgba(238, 238, 238, 0.8)",
		sceneFunc: function(ctx) {
			var x = this.x();
			ctx.beginPath();
			ctx.moveTo(x, ctx_height);
			ctx.lineTo(x, yStart);

			var x_diff = x - xStart;

		    for (var i = 0; i < cloudPoints.length; i++) {
		    	var curve = cloudPoints[i];
		    	ctx.quadraticCurveTo(curve.control_x + x_diff, curve.control_y, curve.end_x + x_diff, curve.end_y);
		    }

		    // fill rest of shape
		    ctx.lineTo(cloudPoints[cloudPoints.length - 1].end_x, ctx_height);
		    ctx.lineTo(xStart + x_diff, ctx_height);
		    ctx.closePath();
		    ctx.fillStrokeShape(this);
		},
	});
	layer.add(cloud);
	stage.add(layer);
	//}

	tween = new Kinetic.Tween({
        node: cloud,
        duration: 60,
        x: 2000,
        onFinish: function () {}
    });
    tween.play();

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
				//animateScene(ctx, opacity);
			}

			// activate "about" header
			if (posTop < $("#projects").height() && posTop > $("#about").height) {
				$("#aboutTab.active > a").css('color', '#2ecc71');
			}
		}
	}, 17);
});