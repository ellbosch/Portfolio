$(document).ready(function() {

	// set kinetic stage
	var fog_stage = new Kinetic.Stage({
		container: 'clouds',
		width: 2000,
		height: $(window).height()
	});

	// create fog scene
	initFogBackground();
	initFog(fog_stage.getWidth(), fog_stage.getHeight(), 0.20);

	// handle window resizing events with smart resize
	$(window).smartresize(function() {
		fog_stage = new Kinetic.Stage({
			container: 'clouds',
			width: 2000,
			height: $(window).height()
		});

		initFogBackground();
		initFog(fog_stage.getWidth(), fog_stage.getHeight(), 0.20);
	});

	var didScroll = false;
	var didClearFog = false;
	$(window).scroll(function() {
	    didScroll = true;
	    scroll_debounce;
	});
	var scroll_debounce = setInterval(function() {
		if (didScroll) {
			didScroll = false;
			// clear fog if user passes offset of content div
		    if (!didClearFog &&	$(window).scrollTop() > $("#content").offset().top) {
		    	didClearFog = true;

		    	// set fog_stage to a new stage to clear it
		    	fog_stage = new Kinetic.Stage({
		    		container: 'clouds',
		    		width: 0,
		    		height: 0
		    	});		        
		    }
		    // recreate fog scene if user scrolls back up to cover page area
		    else if (didClearFog &&	$(window).scrollTop() < $("#content").offset().top) {
		    	didClearFog = false;

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
	}, 250);

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
    		rect_bg.setOpacity(Math.max((scrollMax - scrollTop - 800), 1) / scrollMax);
    	}, layer_bg);

    	anim.start();		
	}

	function initFog(stage_width, stage_height, fog_height) {
		var ctx_height = fog_stage.getHeight();
		var ctx_width = fog_stage.getWidth();
		var xStart = ctx_width;

		// create layers of animating clouds
		var radians = 0;
		while (radians <= Math.PI / 2) {
			var yStart = ctx_height - ($(window).height() * fog_height) - (100 * Math.sin(radians));		// y start of clouds
			var speed = Math.max(50 * Math.sin((Math.PI / 2) - radians), 10);
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
    		cloud.setOpacity(Math.max((scrollMax - scrollTop - 1200), 500) / scrollMax);
    	}, layer);

    	anim.start();
    }

	// parallax, dawg
	//var s = skrollr.init();
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
