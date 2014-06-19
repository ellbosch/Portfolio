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

      	console.log(currentItem);
	});
});