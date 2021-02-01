$(document).ready(function(){
	$(".timeline-block").hover(function(){
		if(this.id == "1"){
			$("body").css("background-image", "url('./pics/1920.png')");			
		}
		if(this.id == "2"){
			$("body").css("background-image", "url('./pics/1930.png')");
		}
		if(this.id == "3"){
			$("body").css("background-image", "url('./pics/1940.png')");
		}
		if(this.id == "4"){
			$("body").css("background-image", "url('./pics/1950.png')");
		}
		if(this.id == "5"){
			$("body").css("background-image", "url('./pics/1960.png')");
		}
		if(this.id == "6"){
			$("body").css("background-image", "url('./pics/1970.png')");
		}
		if(this.id == "7"){
			$("body").css("background-image", "url('./pics/1980.png')");	
		}
		if(this.id == "8"){
			$("body").css("background-image", "url('./pics/1990.png')");
		}
		$(this.children[1]).css({
			"opacity": "1",
			"-webkit-transform": "translate(20px, 0px)",
            "-moz-transform": "translate(20, 0px)",
            "-o-transform": "translate(20, 0px)",
            "-ms-transform": "translate(20, 0px)",
		});
		$(this.children[0].children[0].children[0]).css({
			"-webkit-transform": "translate(0, -60px)",
            "-moz-transform": "translate(0, -60px)",
            "-o-transform": "translate(0, -60px)",
            "-ms-transform": "translate(0, -60px)",
		})
	})
	$(".timeline-block").mouseleave(function(){
		console.log(this.children[1].children[0]);
		$(this.children[1]).css({
			"opacity": "0"
		});
		$(this.children[0].children[0].children[0]).css({
			"-webkit-transform": "translate(0, 0px)",
            "-moz-transform": "translate(0, 0px)",
            "-o-transform": "translate(0, 0px)",
            "-ms-transform": "translate(0, 0px)",
		})
	})
});