$(document).ready(function() {
	// global variable namespace for fog creation
	var Fog = {
		canvas: null,
		context: null,
		WIDTH: 0,
		HEIGHT: 0, 
		clouds_arr: null,
		animCounter: 1,
		// scrollable booleans
		didScroll: false,
		didClearFog: true,
		didClearSpanTitle: true
	};

	// creates animation callback for browswer
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame 			||
		window.webkitRequestAnimationFrame 				||
		window.mozRequestAnimationFrame    				||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	window.cancelRequestAnimFrame = (function() {
	    return window.cancelAnimationFrame          	||
	        window.webkitCancelRequestAnimationFrame    ||
	        window.mozCancelRequestAnimationFrame       ||
	        window.oCancelRequestAnimationFrame    		||
	        window.msCancelRequestAnimationFrame        ||
	        clearTimeout
	})();

	delayInitialElements();				// show/hide elements on page load
	createCanvas();						// create canvas with animating fog
	
	// function call for creating canvas
	function createCanvas() {
		init();								// initialize canvas
		animate();							// inimates cloud objects
	}

	/*********************************************************************
		-- WINDOW SCROLL/RESIZE DEBOUNCERS --
	********************************************************************/

	// handle window resizing events with smart resize
	$(window).smartresize(function() {
		var animRequest = Fog.animRequest;

		if (animRequest != null && Fog.canvas != null) {
			cancelAnimationFrame(animRequest);		// clear requestAnimFrame
			createCanvas();							// recreate canvas and redraw fog with new dimensions
		}
	});

	$(window).scroll(function() {
		Fog.didScroll = true;
		setInterval(scroll_debounce, 250);
	});

	function scroll_debounce() {
		var didScroll = Fog.didScroll;
		var didClearFog = Fog.didClearFog;
		var didClearSpanTitle = Fog.didClearSpanTitle;

		if (didScroll) {
			Fog.didScroll = false;
			var scrollTop = $(window).scrollTop();
			var scrollMax = $("#content").offset().top;

			// fade in span title in cover-page
			if (scrollTop <= 20 && didClearSpanTitle) {
				Fog.didClearSpanTitle = false;
				$("#spanTitle").fadeIn(500, "linear");
			}

			// fade out span title in cover-page
			if (scrollTop > 20 && !didClearSpanTitle) {
				Fog.didClearSpanTitle = true;
				$("#spanTitle").fadeOut(500, "linear");
			}

			// clear fog if user passes offset of content div
			if (!didClearFog &&	scrollTop > scrollMax) {
				Fog.didClearFog = true;
				var width = Fog.WIDTH;
				var height = Fog.HEIGHT;

				cancelAnimationFrame(Fog.animRequest);		// clear requestAnimFrame
				Fog.context.clearRect(-width, -height, width * 2, height * 2);   
			}

		    // recreate fog scene if user scrolls back up to cover page area
		    if (didClearFog &&	scrollTop < scrollMax) {
		    	Fog.didClearFog = false;
		   	
		    	cancelAnimationFrame(Fog.animRequest);		// clear requestAnimFrame
				createCanvas();							// recreate canvas and redraw fog with new dimensions
		    }
		}
	}


	/*********************************************************************
		DELAY ELEMENTS FUNCTION CALL
	*********************************************************************/

	function delayScrollandTitle() {
		$("#scrollDiv").fadeIn(1000, "linear").css("display", "inline-block");
		Fog.didClearFog = false;

		// fade in span title in cover-page
		if ($(window).scrollTop() <= 20) {
			Fog.didClearSpanTitle = false;
			$("#spanTitle").fadeIn(500, "linear");
		}
	}

	function fadeToScene() {
		$("#loadingPage").fadeOut(3000, "linear");
	}

	// funciton call that fades in initial elements
	function delayInitialElements() {
		$("#loadingPage h2").hide();

		// fade out loading screen and fade in clouds
		setTimeout(fadeToScene, 500);
		setTimeout(delayScrollandTitle, 2000);
	};


	/*********************************************************************
		-- CANVAS CREATION --
	*********************************************************************/

	// initializes canvas scene
	function init() {
		Fog.canvas = $("#canvas_fog")[0];
		var canvas = Fog.canvas;

		if (canvas != null) {
			canvas.width = $(window).width();
			canvas.height = $(window).height();

			// assign global variables
			Fog.context = canvas.getContext('2d');
			Fog.HEIGHT = canvas.height;
			Fog.WIDTH = canvas.width;
			Fog.clouds_arr = createClouds(0.17);	// create cloud objects
		}
	}

	function animate() {
		// get rAF
		Fog.animRequest = requestAnimFrame(animate);
		// draw canvas frame
		draw();
		// increment global counter
		Fog.animCounter++;
	}

	// draws canvas cloud shapes
	function draw() {
		var ctx_height = Fog.HEIGHT;
		var ctx_width = Fog.WIDTH;
		var counter = Fog.animCounter;
		var clouds = Fog.clouds_arr;
		var context = Fog.context;

		// clear canvas
		context.clearRect(0, 0, ctx_width, ctx_height);
		// draw background DISABLED RIGHT NOW
		// drawBG(ctx_width, ctx_height, scrollMax, context);
		// draw fog
		drawFog(clouds, ctx_width, ctx_height, counter, context);
	}


	/*********************************************************************
		-- CANVAS FOG SCENE --
	*********************************************************************/

	// create background sunset gradient
	function drawBG(ctx_width, ctx_height, scrollMax, context) {
		/*// set opacity of rectangle
		var scrollTop = $(window).scrollTop();
		var opacity = (scrollMax - (scrollTop * 1.5)) * 0.6 / scrollMax;

		context.beginPath();

		// create gradient
		var grd = context.createLinearGradient(0, ctx_height, 0, 0);
		grd.addColorStop(0.00, 'rgba(255, 135, 51, ' + opacity + ')');
		grd.addColorStop(0.15, 'rgba(255, 192, 65, ' + opacity + ')');
		grd.addColorStop(0.25, 'rgba(255, 246, 158, ' + opacity + ')');
		grd.addColorStop(1.00, 'rgba(101, 201, 228, ' + opacity + ')');
		grd.addColorStop(1.00, 'rgba(80, 168, 249, ' + opacity + ')');

		// fill shape with gradient
		context.closePath();
		context.fillStyle = grd;
		context.rect(0, 0, ctx_width, ctx_height);
		context.fill();*/
	}

	// draw fog on canvas
	function drawFog(clouds, ctx_width, ctx_height, counter, context) {
		// set opacity of clouds
		var scrollTop = $(window).scrollTop();
		var scrollMax = $("#content").offset().top;
		var colorFog = 238;
		var opacity = Math.max(((1 - (0.5 * (scrollTop/scrollMax))) * 0.25), 0.15); //Math.max(((scrollMax - (scrollTop * 0.2)) * 0.1 / scrollMax), 0.25);

		// iterate through every cloud
		for (var i = 0; i < clouds.length; i++) {
			var cloud = clouds[i];
			var x_begin = cloud.x;
			var y_begin = cloud.y;
			var cloudPoints = cloud.curvePoints;
			var dx = cloud.dx;

	    	var x_end = cloudPoints[cloudPoints.length - 1].end_x;
	    	var cloud_length = x_begin - x_end;

	    	// start shape draw
	    	context.fillStyle = "rgba(" + colorFog + ", " + colorFog + ", " + colorFog + ", " + opacity + ")";
	    	context.beginPath();
	    	context.moveTo(x_begin, y_begin);

	    	// draw quadratic curve points, and update the x values
			for (var j = 0; j < cloudPoints.length; j++) {
				var curve = cloudPoints[j];
				var end_x = curve.end_x;
				var end_y = curve.end_y;
				var control_x = curve.control_x;
				var control_y = curve.control_y;

				context.quadraticCurveTo(control_x, control_y, end_x, end_y);
				curve.control_x += dx;
				curve.end_x += dx;
			}

		    // fill rest of shape
		    context.lineTo(x_end, ctx_height);
		    context.lineTo(x_begin, ctx_height);
		    context.closePath();
		    context.fill();

		    // increment x property of cloud object
		    cloud.x += dx;

		    // push new cloud points if end of cloud is approaching viewport
		    if (x_end > -(ctx_width/1440) * 500) {
		    	var newCloudPoints = createCloudPoints(x_end, cloud.y, ctx_width, ctx_height);
		    	cloud.curvePoints = cloudPoints.concat(newCloudPoints);
		    }

		    // only check for every 10 iterations of counter
		    if (counter % 50 == 0) {
			    // shift and remove cloud points if past the viewport
			    while (cloudPoints.length > 1 && cloudPoints[0].end_x > ctx_width + ctx_width/14) {
			    	cloud.y = cloudPoints.shift().end_y;
			    }
			    // restart counter
			   	counter = 1;
			}
			counter++;
		}
	}

	/*********************************************************************
		-- FOG CREATION FUNCTION CALLS --
	*********************************************************************/

	function createClouds(fog_height) {
		var ctx_width = Fog.WIDTH;
		var ctx_height = Fog.HEIGHT;
		var ratio_x = ctx_width/1440;
		var ratio_y = ctx_height/768;

		// instantiate cloud objects(cloud-points, speed)
		var clouds = [];

		var radians = 0;
		while (radians < Math.PI/2) {
			// y "start" of clouds
			var yStart = ctx_height - (ctx_height * fog_height) - (100 * Math.sin(radians) * ratio_y);
			// velocity of cloud
			var velocity = Math.sin((Math.PI / 2) - radians) * ratio_x * 2;
			// genereate random cloud points
			var cloudPoints = createCloudPoints(ctx_width, yStart, ctx_width, ctx_height);
			
			// create cloud object
			var cloud = {
				curvePoints: cloudPoints,
				x: ctx_width,
				y: yStart,
				dx: velocity
			};

			// add cloud to global array
			clouds.push(cloud);	

			radians += Math.PI / 20;
		}

		return clouds;
	}
	
	// assign points for curvatures of cloud
	function createCloudPoints(x_begin, y_begin, ctx_width, ctx_height) {
		var cloudCurvePoints = [];		// instantiate array of cloud points to return

		var curve_x = x_begin;
		var cloud_length = ctx_width + 500;

		while (curve_x > x_begin - cloud_length) {
			quadCurvePoints = newCloudPoints(curve_x, y_begin, ctx_width, ctx_height);		// creates object of points used for draw()
			cloudCurvePoints.push(quadCurvePoints);
			curve_x = quadCurvePoints.end_x;
		}

		//cloudCurvePoints[cloudCurvePoints.length-1].end_y = y_begin;

		return cloudCurvePoints;
	}

	// assign one set of points
	function newCloudPoints(curve_x, y_begin, ctx_width, ctx_height) {
		var ratio_w = ctx_width/1440;
		var ratio_y = ctx_height/1000;
		// change in x
		var x_rand = (Math.ceil(Math.random() * 60) + 100) * ratio_w;
		// change in y
		var y_rand = y_begin + ((Math.ceil(Math.random() * 30) - 15) * ratio_w);
		// curve height
		var curveHeight = y_rand - (Math.ceil(Math.random() * 50) * ratio_w);
		
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
