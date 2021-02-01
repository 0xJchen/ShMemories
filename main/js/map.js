$.ajaxPrefilter( "json script", function( options ) {
    options.crossDomain = true;
  });

  var ipAddress = null;

  $(document).ready(function () {
      $.ajax({
          url: './json/1/',
          async: false,
          success: function (data) {
              ipAddress = data.ip;
          }
      });
      console.log("ojaod");
      $.getJSON("./json/1/1.json",function(result){
        console.log("ddjj");
        console.log(result);
        console.log("error");
      });

      
  });
  console.log("fii")
  
  

  