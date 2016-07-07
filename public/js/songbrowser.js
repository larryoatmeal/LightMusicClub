var endpoint = "http://localhost:8080/";
//var endpoint = "http://localhost:8080/";


$(document).ready(function(){

    function getSongs(name){
        var path = endpoint + "usersongs/";
        if(name){
            path += "?name=" + name;
        }
        console.log(path);

        $.get(path).done(function(data){
            console.log(data);
            populateForm(data);
        });
    }

    function populateForm(songs){
        clearTable();
        songs.forEach(function(song){
            drawRow(song);
        });
    }

    function clearTable(){
        $("#song-table-body").empty();

    }
    function drawRow(song) {
        var row = $("<tr />");
        $("#song-table-body").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        row.append($("<td contenteditable='true' >" + song.name + "</td>"));
        row.append($("<td contenteditable='true' >" + song.audio + "</td>"));
        row.append($("<td contenteditable='true' >" + song.midi + "</tdm>"));
        row.append($("<td contenteditable='true' >" + song.midi + "</tdm>"));
    }

    getSongs();

    $('[contenteditable=true]')
    // When you click on item, record into data("initialText") content of this item.
    .focus(function() {
        $(this).data("initialText", $(this).html());
    })
    // When you leave an item...
    .blur(function() {
        // ...if content is different...
        if ($(this).data("initialText") !== $(this).html()) {
            // ... do something.
            console.log('New data when content change.');
            console.log($(this).html());
        }
    });



    // alert("HI")
    //$( "#songEntryForm" ).submit(function( event ) {
    //    // alert( "Handler for .submit() called." );
    //    var name = $("#title").val();
    //    var audio = $("#audio").val();
    //    var midi = $("#midi").val();
    //    var thumbnail = $("#thumbnail").val();
    //    var background = $("#background").val();
    //
    //    var difficulty = $("#difficulty").val();
    //    var composer = $("#composer").val();
    //    var album = $("#album").val();
    //    var pub = $("#public").is(":checked");
    //
    //    var song = {
    //        "name":  name,
    //        "audio": audio,
    //        "midi": midi,
    //        "thumbnail": thumbnail,
    //        "background": background,
    //        "difficulty": difficulty,
    //        "composer": composer,
    //        "album": album,
    //        "public": pub
    //    };
    //
    //    //if(!name || !audio || !midi){
    //    //	console.log("HERE");
    //    //	alert("Title, audio, and midi fields must be completed");
    //    //}else{
    //    $.post(endpoint + "createSong", song).done(function( data ) {
    //    });
    //
    //    //}
    //});
});