$(document).ready(function() {
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
		// fade to next page if at beginning
		if ($(document).scrollTop() < $("#cover-page").height()) {
			$(window)
			$(".container").fadeIn("slow");
		} 
		if ($("#cover-page").is(':hidden') && $(document).scrollTop() == 0) {
			//$("#cover-page").fadeIn("slow");
		}

		if ($(document).scrollTop() < 100) {
  			$("#aboutTab a").css('color', '#EEEEEE');
  		} else {
  			$("#aboutTab.active > a").css('color', 'red');
  		}
	});

	// parallelx animations, dawg
	var parOffset = 49;
	$.stellar(/*{
		horizontalOffset: parOffset,
		verticalOffset: parOffset
	}*/);
});