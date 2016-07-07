var endpoint = "http://dna-sogima.rhcloud.com/";
//var endpoint = "http://localhost:8080/";

$(document).ready(function(){
	// alert("HI")
	$( "#submitButton" ).on("click", function( event ) {
	  // alert( "Handler for .submit() called." );
		var name = $("#title").val();
		var audio = $("#audio").val();
		var midi = $("#midi").val();
		var thumbnail = $("#thumbnail").val();
		var background = $("#background").val();

		var difficulty = $("#difficulty").val();
		var composer = $("#composer").val();
		var album = $("#album").val();
		var pub = $("#public").is(":checked");


		var song = {
	  		"name":  name,
	  		"audio": audio,
	  		"midi": midi,
	  		"thumbnail": thumbnail,
	  		"background": background,
	  		"difficulty": difficulty,
	  		"composer": composer,
	  		"album": album,
			"public": pub
	  	};

		if($("#_id")){
			song._id = $("#_id").val();
		}

	  	//if(!name || !audio || !midi){
	  	//	console.log("HERE");
	  	//	alert("Title, audio, and midi fields must be completed");
	  	//}else{
		$.post(endpoint + "createSong", song).done(function( redir ) {
			console.log(redir);
			window.location.href = redir;
		});

	  	//}
	});
});