$(document).ready(function() {
	// global variable namespace for fog creation
	var Fog = {
		canvas: null,
		context: null,
		WIDTH: 0,
		HEIGHT: 0, 
		clouds_arr: null,
		animCounter: 1,
		windowHeight: 0,
		// scrollable booleans
		on_scroll: false,
		is_on_cover_page: false,
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

	// cancels animation callback
	window.cancelRequestAnimFrame = (function() {
	    return window.cancelAnimationFrame          	||
	        window.webkitCancelRequestAnimationFrame    ||
	        window.mozCancelRequestAnimationFrame       ||
	        window.oCancelRequestAnimationFrame    		||
	        window.msCancelRequestAnimationFrame        ||
	        clearTimeout
	})();

	// mobile browser check
	var isMobile = window.matchMedia("only screen and (min-device-width : 320px) and (max-device-width : 568px)");
	var isTablet = window.matchMedia("only screen and (min-device-width : 768px) and (max-device-width : 1024px)");

	initGlobals();						// calculate global variables
	fadeToScene();
	set_sf_image_size();
	createCanvas();						// create canvas with animating fog
	
	// if (isMobile.matches || isTablet.matches) {	} 	// useful check for mobile devices, if ya want to use it

	// pause bootstrap carousel
	$("#safetypenn-carousel").carousel('pause');
	
	/*********************************************************************
		-- FUNCTIONS TO INITIALIZE SCENE --
	********************************************************************/

	// calculate certain globals
	function initGlobals() {
		Fog.windowHeight = $(window).height();
		// Fog.contentTop = $("#projects").offset().top;
	}

	// function call for creating canvas
	function createCanvas() {
		init();								// initialize canvas
		animate();							// inimates cloud objects
	}

	function set_sf_image_size() {
		var $cover_page_img = $("#cover-page_img");
		var window_width = $(window).width();
		var window_height = $(window).height();
		var img_height = $cover_page_img.height();
		var margin_left = (window_width <= 1072) ? -(1072 - window_width)/2 : 0;
		var margin_top = (img_height <= 801) ? 0 : -(img_height - 801)/2;

		if (window_width/window_height > 1.339) {
			$cover_page_img.css({
				"width": "100%",
				"height": "auto",
				"margin-left": margin_left,
				"margin-top": margin_top
			});
		} else {
			$cover_page_img.css({
				"width": "auto",
				"height": "100%",
				"margin-left": margin_left,
				"margin-top": margin_top
			});
		}
	}


	/*********************************************************************
		-- WINDOW EVENT HANDLERS --
	********************************************************************/

	// menu events
	$(".menu .icon-list a").on('click', function(e) {
		var clicked_item = $(this).attr("href");

		if (clicked_item != "attachments/BoschwitzElliot_resume.pdf") {
			e.preventDefault();
			var is_on_cover_page = Fog.is_on_cover_page;
			switch (clicked_item) {
				case "#cover-page":
					if (!is_on_cover_page) go_to_cover_page();
					break;
				case "#projects":
					if (is_on_cover_page) go_to_content();
					else {
						$("#content").animate({ scrollTop: 10 }, 1000);
					}
					break;
				case "#contact":
					if (is_on_cover_page) {
						go_to_content();
					}
					$("#content").animate({ scrollTop: $("#projects").height() }, 1000);
			}
		}
	});

	// TO-DO: REMOVE OLD LINKS DOWN HERE WITH FONTAWESOME

	// change images when hovering over contact links
	$("#socialLinks img").hover(
		// mouseover
		function() {
			var img_hover = $(this).attr("alt");
			switch (img_hover) {
				case "GitHub":
					$(this).attr("src", "images/githubHover.png");
					break;
				case "LinkedIn":
					$(this).attr("src", "images/linkedinHover.png");				
					break;
				case "Facebook":
					$(this).attr("src", "images/facebookHover.png");
			}
		},
		// mouseleave
		function() {
			var img_hover = $(this).attr("alt");
			switch (img_hover) {
				case "GitHub":
					$(this).attr("src", "images/github.png");
					break;
				case "LinkedIn":
					$(this).attr("src", "images/linkedin.png");				
					break;
				case "Facebook":
					$(this).attr("src", "images/facebook.png");
			}
		}
	);

	// animate to content when scroll button is clicked
	$("#scrollDiv").on('click', function() {
		$("html, body").animate({ scrollTop: $("#content").offset().top }, {
			duration: 600
		});
	});

	// handle window resizing events with smart resize
	$(window).smartresize(function() {
		var animRequest = Fog.animRequest;
		var scrollTop = $(window).scrollTop();

		// recalculate globals
		initGlobals();
		set_sf_image_size();

		if (animRequest != null && Fog.canvas != null) {
			cancelAnimationFrame(animRequest);		// clear requestAnimFrame
			createCanvas();							// recreate canvas and redraw fog with new dimensions
		}
	});

	// SCROLL HANDLERS
	Fog.on_scroll = false;
	Fog.is_on_cover_page = $("#cover-page").is(":visible");


	$(window).scroll(function() {
		Fog.on_scroll = true;
		setInterval(scroll_debounce(), 100);
	});

	function scroll_debounce() {
		if (Fog.on_scroll) {
			Fog.on_scroll = false;
			// var scrollTop = $dom.scrollTop();
			var scrollTop = $(window).scrollTop();
			var is_on_cover_page = Fog.is_on_cover_page;

			// go back to cover page if user scrolls up all the way

			// TO-DO: ENABLE BELOW WHEN TRANSITIONS ARE FIXED

			// if (scrollTop == 0 && !is_on_cover_page) {
			// 	go_to_cover_page();
			// }
			// go to content
			// else if (scrollTop >= 9 && is_on_cover_page) {
			// 	hide_cover_page();
			// }

			// TEMPORARY CODE TO REMOVE WHEN TRANSITIONS ARE FIXED
			var height_enable_fog = $("#content").offset().top;
			if (scrollTop <= height_enable_fog && !is_on_cover_page) {
				go_to_cover_page();
			} else if (scrollTop > height_enable_fog && is_on_cover_page) {
				hide_cover_page();
			}

		}
	}

	// jumps to cover page and sets global booleans
	function go_to_cover_page() {
		Fog.is_on_cover_page = true;
		// PageTransitions.nextPage(26);
		
		// TO-DO: RE-ENABLE BELOW FOR TRANSITIONS
		// $("#content").fadeOut("slow");

		// recreate fog
		cancelAnimationFrame(Fog.animRequest);	// clear requestAnimFrame
		createCanvas();							// recreate canvas and redraw fog with new dimensions
	}

	// jumps to content and sets global booleans
	function hide_cover_page() {
		Fog.is_on_cover_page = false;
		// PageTransitions.nextPage(25);
		
		// TO-DO: RE-ENABLE BELOW FOR TRANSITIONS
		// $("#content").fadeIn("slow");

		// clear canvas scene
		var width = Fog.WIDTH;
		var height = Fog.HEIGHT;
		cancelAnimationFrame(Fog.animRequest);		// clear requestAnimFrame
		Fog.context.clearRect(-width, -height, width * 2, height * 2);
		// remove clouds from heap
		delete Fog.clouds_arr;
	}


	/*********************************************************************
		DELAY ELEMENTS FUNCTION CALL
	*********************************************************************/

	// funciton call that fades in initial elements
	// function delayInitialElements() {
	// 	var scrollTop = $(window).scrollTop();

	// 	// set nav color
	// 	// if (scrollTop > $("#projects").offset().top) {
	// 	// 	if ($(window).width() > 562)
	// 	// 		$("nav").css('background-color', 'rgba(238, 238, 238, 0.9');
	// 	// 	else
	// 	// 		$("nav").css('background-color', '#3F4995');
	// 	// } else {
	// 	// 	if ($(window).width() > 562)
	// 	// 		// remove translucency to nav
	// 	// 		$("nav").css('background-color', 'rgba(238, 238, 238, 0');
	// 	// 	else
	// 	// 		$("nav").css('background-color', '#3F4995');
	// 	// }

	// 	$("html").css('overflow', 'auto');			// turn off overflow
	// 	$(".signal").hide();						// hide loading animation

	// 	// fade out loading screen and fade in clouds
	// 	setTimeout(fadeToScene, 500);
	// 	setTimeout(delayScrollandTitle, 2000);
	// };

	// function delayScrollandTitle() {
	// 	Fog.didClearFog = false;
		
	// 	$("#scrollDiv").fadeIn(1000, "linear").css("display", "inline-block");
	// 	$("#coverPageHeader").fadeIn(500, "linear");
	// }

	function fadeToScene() {
		$("#loadingPage").fadeOut(1000, "linear");
	}


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
			Fog.clouds_arr = createClouds(0.30);	// create cloud objects
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
	
		// draw fog
		drawFog(clouds, ctx_width, ctx_height, counter, context);
	}


	/*********************************************************************
		-- CANVAS FOG SCENE --
	*********************************************************************/

	// draw fog on canvas
	function drawFog(clouds, ctx_width, ctx_height, counter, context) {
		// set opacity and color of clouds
		var colorFog = 238;
		var opacity = 0.25;

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
			var yStart = ctx_height - (ctx_height * fog_height * (1-ratio_x*0.5)) - (100 * Math.sin(radians) * ratio_y);
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
		var y_rand = y_begin + ((Math.ceil(Math.random() * 30) - 15) * ratio_y);
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
