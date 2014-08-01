$(document).ready(function() {

	/*********************************************************************
		-- INITIALIZE FOG SCENE --
		*********************************************************************/

	// create fog scene
	//initFogBackground();
	initFog(0.20);

	// show/hide elements on page load
	delayInitialElements();


	/*********************************************************************
		-- WINDOW SCROLL/RESIZE DEBOUNCERS --
	*********************************************************************/

	// handle window resizing events with smart resize
	/*
	$(window).smartresize(function() {
		fog_stage = new Kinetic.Stage({
			container: 'clouds',
			width: $(window).width(),
			height: $(window).height()
		});
		initFogBackground();
		initFog(fog_stage.getWidth(), fog_stage.getHeight(), 0.20);
	});

	var didScroll = false;
	var didClearFog = false;
	var didClearSpanTitle = false;
	$(window).scroll(function() {
		didScroll = true;
		scroll_debounce;
	});

	var scroll_debounce = setInterval(function() {
		if (didScroll) {
			didScroll = false;

			// fade in span title in cover-page
			if ($(window).scrollTop() <= 20 && didClearSpanTitle) {
				didClearSpanTitle = false;
				$("#spanTitle").fadeIn(500, "linear");
			}

			// fade out span title in cover-page
			if ($(window).scrollTop() > 20 && !didClearSpanTitle) {
				didClearSpanTitle = true;
				$("#spanTitle").fadeOut(500, "linear");
			}

			// clear fog if user passes offset of content div
			if (!didClearFog &&	$(window).scrollTop() > $("#content").offset().top) {
				didClearFog = true;
				$("#clouds").hide();
				fog_stage.destroyChildren();
				fog_stage.destroy();		        
			}

		    // recreate fog scene if user scrolls back up to cover page area
		    if (didClearFog &&	$(window).scrollTop() < $("#content").offset().top) {
		    	didClearFog = false;
		    	$("#clouds").show();

		    	// recreate fog scene
		    	fog_stage = new Kinetic.Stage({
		    		container: 'clouds',
		    		width: 2000,
		    		height: $(window).height()
		    	});

		    	initFogBackground();
		    	initFog(fog_stage.getWidth(), fog_stage.getHeight(), 0.20);
		    }
		}
	}, 250); */



	/*********************************************************************
		DELAY ELEMENTS FUNCTION CALL
	*********************************************************************/

	// funciton call that fades in initial elements
	function delayInitialElements() {
		$("#loadingPage h2").hide();

		// fade out loading screen and fade in clouds
		setTimeout(function () {
			$("#loadingPage").fadeOut(3000, "linear");
			$("#clouds").fadeIn("slow");

			setTimeout(function() {
				$("#scrollDiv").fadeIn(1000, "linear").css("display", "inline-block");
				$("#spanTitle").fadeIn(1500, "linear");
			}, 2000);
		}, 500);
	};


	/*********************************************************************
		-- FOG SCENE BACKGROUND FUNCTION CALL --
	*********************************************************************/

	// create background sunset gradient
	function initFogBackground() {

		// create sunrise background
		var layer_bg = new Kinetic.Layer();
		var rect_bg = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: fog_stage.getWidth(),
			height: fog_stage.getHeight(),
			fillLinearGradientStartPoint: { x: 0, y: fog_stage.getHeight() },
			fillLinearGradientEndPoint: { x: 0, y: 0 },
			fillLinearGradientColorStops: [0.00, 'rgb(255, 135, 51)',
			0.20, 'rgb(255, 192, 65)',
			0.30, 'rgb(255, 246, 158)',
			0.50, 'rgb(101, 201, 228)',
			1.00, 'rgb(80, 168, 249)']
		});
		layer_bg.add(rect_bg);
		fog_stage.add(layer_bg);

		var anim = new Kinetic.Animation(function(frame) {
			var scrollMax = $("#content").offset().top;
			var scrollTop = $(window).scrollTop();
			rect_bg.setOpacity(Math.max((scrollMax - scrollTop - 1000), 1) / scrollMax);

			if (didClearFog) anim.stop();
		}, layer_bg);

		anim.start();		
	}


	/*********************************************************************
		-- FOG CREATION FUNCTION CALLS --
	*********************************************************************/

	var canvas, context;

	function initFog(fog_height) {

		// animation
		window.requestAnimFrame = (function() {
			return  window.requestAnimationFrame    ||
			window.webkitRequestAnimationFrame 		||
			window.mozRequestAnimationFrame    		||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		})();

		init();

		// instantiate cloud objects(cloud-points, speed)
		var clouds = [];

		var radians = 0;
		while (radians <= Math.PI / 2) {
			// y "start" of clouds
			var yStart = canvas.height - ($(window).height() * fog_height) - (100 * Math.sin(radians));
			// velocity of cloud
			var velocity = Math.max(70 * Math.sin((Math.PI / 2) - radians), 10);
			// genereate random cloud points
			var cloudPoints = createCloudPoints(canvas.width, yStart);
			var cloud = {
				curvePoints: cloudPoints,
				x: canvas.width,
				y: yStart,
				dx: velocity / 90
			};
			clouds.push(cloud);	

			radians += Math.PI / 6;
		}

		animate();

		function init() {
			canvas = $("#canvas_fog")[0];
			canvas.width = $(window).width();
			canvas.height = $(window).height();
			context = canvas.getContext('2d');
		}

		function animate() {
			requestAnimFrame(animate);
			draw();
		}


		// UPDATE TO TAKE CLOUD OBJECT
		function draw() {
			// clear canvas
			context.clearRect(0, 0, canvas.width, canvas.height);

			// iterate through every cloud
			for (var i = 0; i < clouds.length; i++) {
				var cloud = clouds[i];
				var x_begin = cloud.x;
				var y_begin = cloud.y
				var cloudPoints = cloud.curvePoints;

		    	var x_end = cloudPoints[cloudPoints.length - 1].end_x;
		    	var cloud_length = x_begin - x_end;

		    	// start shape draw
		    	context.fillStyle = "rgba(238, 238, 238, 0.4)";
		    	context.beginPath();
		    	context.moveTo(x_begin, y_begin);

		    	// draw quadratic curve points, and update the x values
				for (var j = 0; j < cloudPoints.length; j++) {
					var curve = cloudPoints[j];
					context.quadraticCurveTo(curve.control_x, curve.control_y, curve.end_x, curve.end_y);
					curve.control_x += cloud.dx;
					curve.end_x += cloud.dx;
				}

			    // fill rest of shape
			    context.lineTo(x_end, canvas.height);
			    context.lineTo(x_begin, canvas.height);
			    context.closePath();
			    context.fill();

			    // increment x property of cloud object
			    cloud.x += cloud.dx;

			    // push new cloud points if end of cloud is approaching viewport
			    if (x_end > -121) {
			    	var quadCurvePoints = newCloudPoints(x_end, cloud.y);
			    	cloudPoints.push(quadCurvePoints);
			    }

			    // shift and remove cloud points if past the viewport
			    if (cloudPoints.length > 1 && cloudPoints[0].end_x > canvas.width + 121) {
			    	var oldCloudPoints = cloudPoints.shift();
			    	cloud.y = oldCloudPoints.end_y;
			    }
			}
		}

	/*
		// create layers of animating clouds
		var radians = 0;
		while (radians <= Math.PI / 2) {
			var yStart = ctx_height - ($(window).height() * fog_height) - (100 * Math.sin(radians));		// y start of clouds
			var speed = Math.max(70 * Math.sin((Math.PI / 2) - radians), 10);
			createRollingFog(ctx_width + 200, yStart, speed);
			radians += Math.PI / 6;
		}*/
	}

	// creates entire rolling fog scene
/*	function createRollingFog(x_begin, y_begin, cloud_speed) {
		var layer = new Kinetic.Layer();
		fog_stage.add(layer);

		// create points
		var cloudPoints = createCloudPoints(x_begin, y_begin);

		// create shape
		var cloud = drawCloud(x_begin, cloudPoints, layer);

		// create animation
		var cloud_length = x_begin - cloudPoints[cloudPoints.length - 1].end_x;
		createCloudAnim(x_begin, y_begin, cloud_length, cloud_speed, cloud, layer);
	} */
	
	// assign points for curvatures of cloud
	function createCloudPoints(x_begin, y_begin) {
		var ctx_height = canvas.height;
		var cloudCurvePoints = [];
		var curve_x = x_begin;
		var cloud_length = canvas.width + 500;

		while (curve_x > x_begin - cloud_length) {
			quadCurvePoints = newCloudPoints(curve_x, y_begin);		// creates object of points used for draw()
			cloudCurvePoints.push(quadCurvePoints);
			curve_x = quadCurvePoints.end_x;
		}

		return cloudCurvePoints;
	}

	function newCloudPoints(curve_x, y_begin) {
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

		return quadCurvePoints;
	}

/*
    // draw cloud
    function drawCloud(x_begin, cloudPoints, layer) {
    	var ctx_height = fog_stage.getHeight();
    	var x_end = cloudPoints[cloudPoints.length - 1].end_x;
    	var cloud_length = x_begin - x_end;
    	var color_rand = Math.floor(Math.random() * 20) + 228;

    	var cloud = new Kinetic.Shape({
    		x: x_begin,
    		fill: "rgba(238, 238, 238, 0.4)",

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
    		} else if ((dist - cloud_length + x_begin > ctx_width + 5000 && hasDrawnNewCloud) ||
    			didClearFog) {
    			layer.remove(cloud);
    			fog_stage.remove(layer);
    			anim.stop();
    		}
    		cloud.setX(dist);
    		cloud.setOpacity(Math.max(((scrollMax - scrollTop) / (2/3 * scrollMax)), 0.4));
    	}, layer);

    	anim.start();
    }
*/
    /*********************************************************************
		-- PARALLAX PLUGIN --
		*********************************************************************/

	// parallax, dawg
	var s = skrollr.init({
		render: function(data) {
            //Debugging - Log the current scroll position.
            //console.log(data.curTop);
        }
    });
});

(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
  	var timeout;

  	return function debounced () {
  		var obj = this, args = arguments;
  		function delayed () {
  			if (!execAsap)
  				func.apply(obj, args);
  			timeout = null;
  		};

  		if (timeout)
  			clearTimeout(timeout);
  		else if (execAsap)
  			func.apply(obj, args);

  		timeout = setTimeout(delayed, threshold || 100);
  	};
  }
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
