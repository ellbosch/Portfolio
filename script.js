$(document).ready(function() {

	var fog_stage = new Kinetic.Stage({
		container: 'clouds',
		width: 2000,
		height: 600
	});

	initFog(2000, 600, 0.25);

	function initFog(stage_width, stage_height, cloud_height) {

		var ctx_height = fog_stage.getHeight();
		var ctx_width = fog_stage.getWidth();
		var xStart = ctx_width;

		// create layers of animating clouds
		var radians = 0;
		while (radians <= Math.PI / 2) {
			var yStart = ctx_height - ($(window).height() / 5) - (100 * Math.sin(radians));		// y start of clouds
			var speed = Math.max(1000 * Math.sin((Math.PI / 2) - radians), 10);
			createRollingFog(ctx_width + 200, yStart, speed);
			radians += Math.PI / 10;
		}
	}

	// creates entire rolling fog scene
	function createRollingFog(x_begin, y_begin, cloud_speed) {
		var layer = new Kinetic.Layer();
		fog_stage.add(layer);

		// create points
		var cloudPoints = createCloudPoints(x_begin, y_begin);

		// create shape
		var cloud = drawCloud(x_begin, cloudPoints, layer);

		// create animation
		var cloud_length = x_begin - cloudPoints[cloudPoints.length - 1].end_x;
		createCloudAnim(x_begin, y_begin, cloud_length, cloud_speed, cloud, layer);
	}
	
	// assign points for curvatures of cloud
	function createCloudPoints(x_begin, y_begin) {
		var ctx_height = fog_stage.getHeight();
		var cloudCurvePoints = [];
	    var curve_x = x_begin;
	    var cloud_length_rand = Math.ceil(Math.random() * 3000) + 5000;

	    while (curve_x > x_begin - cloud_length_rand) {
			// change in x between 60 and 120
			var x_rand = Math.ceil(Math.random() * 60) + 100;
			// change in y bewtween 0 and 10
			var y_rand = Math.ceil(Math.random() * 40) + y_begin;
			// curve height between 15 and 25
			var curveHeight = Math.ceil(Math.random() * 10) + (y_begin - 15);
			var x_new = curve_x - x_rand;

			// create object of quadratric curve points
			var quadCurvePoints = {
				control_x: curve_x - (x_rand/2),
				control_y: curveHeight,
				end_x: x_new,
				end_y: y_rand
			}
			cloudCurvePoints.push(quadCurvePoints);
	    	curve_x = x_new;
		}

		// add new quadratic curve points to the end
		var curveEndHeight = Math.ceil(Math.random() * 10) + (y_begin - 15);
		var quadEndCurvePoints = {
			control_x: curve_x - 150,
			control_y: curveEndHeight + 30,
			end_x: curve_x - 200,
			end_y: ctx_height
		}
		cloudCurvePoints.push(quadEndCurvePoints);
		return cloudCurvePoints;
	}

    // draw cloud
    function drawCloud(x_begin, cloudPoints, layer) {
		var ctx_height = fog_stage.getHeight();
		var ctx_width = fog_stage.getWidth();
    	var x_end = cloudPoints[cloudPoints.length - 1].end_x;
    	var cloud_length = x_begin - x_end;

		var cloud = new Kinetic.Shape({
			x: x_begin,
			fill: "rgba(238, 238, 238, 0.8)",

			sceneFunc: function(ctx) {
				var x = this.x();
				ctx.beginPath();
				ctx.moveTo(x_begin + 100, ctx_height);

			    for (var i = 0; i < cloudPoints.length; i++) {
			    	var curve = cloudPoints[i];
			    	ctx.quadraticCurveTo(curve.control_x, curve.control_y, curve.end_x, curve.end_y);
			    }

			    // fill rest of shape
			    ctx.lineTo(x_begin, ctx_height);
			    ctx.closePath();
			    ctx.fillStrokeShape(this);
			},
		});
		layer.add(cloud);
		return cloud;
	}

	function createCloudAnim(x_begin, y_begin, cloud_length, cloud_speed, cloud, layer) {
		// move a node to the right at 50 pixels / second
		var ctx_height = fog_stage.getHeight();
		var ctx_width = fog_stage.getWidth();
		var velocity = cloud_speed;
		var hasDrawnNewCloud = false;
		var scrollMax = $("#content").offset().top;

		var anim = new Kinetic.Animation(function(frame) {
			var dist = velocity * (frame.time / 1000);
			var scrollTop = $(window).scrollTop();

			if (dist - cloud_length + x_begin > -600 && !hasDrawnNewCloud) {
	        	createRollingFog((x_begin + dist) - cloud_length + 300, y_begin, cloud_speed);
				hasDrawnNewCloud = true;
			} else if (dist - cloud_length + x_begin > ctx_width + 5000 && hasDrawnNewCloud) {
				layer.remove(cloud);
				fog_stage.remove(layer);
				anim.stop();
			}
			cloud.setX(dist);
			cloud.setOpacity(Math.max((scrollMax - scrollTop - 1000), 1) / scrollMax);
		}, layer);

		anim.start();
	}

	// parallax, dawg
	//var s = skrollr.init();

	// var didScroll = false;
	// var isAtTop = true;


	// // bootstrap scroll-spy
	// $("body").scrollspy({ target: "#navbar" });
	// $('[data-spy="scroll"]').each(function () {
	// 	var $spy = $(this).scrollspy('refresh');
	// });
	// $('#navbar').on('activate.bs.scrollspy', function () {
	// 	$(".nav li a").css('color', '#EEEEEE');
	// 	$(".nav li.active > a").css('color', '#2ecc71');
	// });

	// // animate scrollspy
	// $("#navbar ul li a[href^='#']").on('click', function(e) {
	// 	// prevent default anchor click behavior
	// 	e.preventDefault();

	// 	// store hash
	// 	var hash = this.hash;

	// 	// animate
	// 	$('html, body').animate({
	// 		scrollTop: $(this.hash).offset().top
	// 	}, 300, function(){

	// 	   // when done, add hash to url
	// 	   // (default click behaviour)
	// 	   window.location.hash = hash;
	// 	});

	// });

	// // make sure all nav elements are deactive
	// $(window).scroll(function(event) {
	// 	didScroll = true;

	// 	if ($(document).scrollTop() < 400) {
	// 		//preventDefault(event);
	// 	}
	// });

	// set delay to performing actions involving a scroll event
	// setInterval(function() {
	// 	var posTop = $(document).scrollTop();

	// 	if (didScroll) {
	// 		didScroll = false;

	// 		// add opacity to nav when off cover page
	// 		if (posTop > $(window).height() * 3) {
	// 			$("#navbar").css('background-color','rgba(255,255,255,0.9)');
	// 		} else {
	// 			$("#navbar").css('background-color','rgba(255,255,255,0)');
	// 			// change opacity in clouds cuz we high
	// 			var opacity = posTop / ($(window).height() * 3);
	// 			//animateScene(ctx, opacity);
	// 		}

	// 		// activate "about" header
	// 		if (posTop < $("#projects").height() && posTop > $("#about").height) {
	// 			$("#aboutTab.active > a").css('color', '#2ecc71');
	// 		}
	// 	}
	// }, 17);
});