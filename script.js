$(document).ready(function() {
	// bootstrap scroll-spy
	$("body").scrollspy({ target: "#navbar" });
	$('[data-spy="scroll"]').each(function () {
  		var $spy = $(this).scrollspy('refresh');
	});
	$('#navbar').on('activate.bs.scrollspy', function () {
		$(".nav li a").css('color', '#EEEEEE');
  		var currentItem = $(".nav li.active > a").text();

  		console.log("window pos: " + $(document).scrollTop() + "; about pos: " + $("#about").position().top);
  		//if ($(document).scrollTop() > $("#about").position().top) {
  			$(".nav li.active > a").css('color', 'red');
  		//}
	});
	// make sure all nav elements are deactive
	$(window).scroll(function() {
		if ($(document).scrollTop() < 100) {
  			$("#aboutTab a").css('color', '#EEEEEE');
  			window.moveTo($("#about").position());
  		} else {
  			$("#aboutTab.active > a").css('color', 'red');
  		}
	});
	// $("#scroll-button").click(function() {
	// 	alert("AHA!");
	// 	window.location=$(this).find("a").attr("href"); 
	// });
});