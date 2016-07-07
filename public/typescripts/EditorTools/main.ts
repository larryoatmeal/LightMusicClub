

var endpoint = "http://localhost:8080/";
//var endpoint = "http://localhost:8080/";
var audioRoot = "uploads/audio/";

$(document).ready(function() {

    var id = $("#_id").val();
    var audioPath = $("#audioPath").val();

    console.log(id);
    console.log(audioPath);

    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        scrollParent: true
    });
    wavesurfer.enableDragSelection({});
    wavesurfer.load(audioRoot + audioPath);

    $("#btnPlay").click(function(ev){
        wavesurfer.playPause();
    });

    var slider = $("#zoomSlider");
    slider.oninput = function () {
        console.log("Zooming");
        var zoomLevel = Number(slider.value);
        wavesurfer.zoom(zoomLevel);
    };

});