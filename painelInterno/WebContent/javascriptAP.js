$(document).ready(function(){

	$("#btng").click(function(){
		ip = "192.168.4.1";
		root = "";
		root += "http://";
		root += ip;
		root += "/post";
		$.ajax({url: root, success: function(result){
			
		}});
	});

});