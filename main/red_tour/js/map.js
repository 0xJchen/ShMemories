$.ajaxPrefilter( "json script", function( options ) {
    options.crossDomain = true;
  });

  var ipAddress = null;

  $(document).ready(function () {
      $.ajax({
		  type: "get",
          url: './json/1/',
          success: function (data) {
              ipAddress = data.ip;
          }
      });
      console.log("ojaod");
      $.getJSON("./json_v2.0/1_1.json",function(result){
        console.log("ddjj");
        console.log(result);
        console.log("error");
      });

      
  });
  console.log("fii")
  
  

  