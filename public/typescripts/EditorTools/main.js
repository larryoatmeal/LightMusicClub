define(["require", "exports", "./MarkerView", "./MarkerManager", "./MarkerController"], function (require, exports, MarkerView_1, MarkerManager_1, MarkerController_1) {
    var endpoint = "http://localhost:8080/";
    var audioRoot = "uploads/audio/";
    $(document).ready(function () {
        var id = $("#_id").val();
        var audioPath = $("#audioPath").val();
        console.log(id);
        console.log(audioPath);
        var wavesurfer = WaveSurfer.create({
            container: '#waveform',
            scrollParent: true,
            height: 256
        });
        wavesurfer.load(audioRoot + audioPath);
        $("#btnPlay").click(function (ev) {
            wavesurfer.play();
        });
        $("#btnStop").click(function (ev) {
            wavesurfer.pause();
        });
        var markerManager = new MarkerManager_1.WavesurferMarkerManager(wavesurfer);
        var markerView = new MarkerView_1.WavesurferMarkerView(wavesurfer, { containerSelector: "#waveform", snapVertical: true });
        var controller = new MarkerController_1.MarkerController(markerManager, markerView);
        Mousetrap.bind("space", function (event) {
            wavesurfer.playPause();
        });
        Mousetrap.bind("a", function () {
            console.log("Pressed a");
            console.log(wavesurfer.getCurrentTime());
            controller.add();
        });
        Mousetrap.bind("d", function () {
            console.log(markerManager.log());
        });
        Mousetrap.bind("f", function () {
            wavesurfer.params.autoCenter = !wavesurfer.params.autoCenter;
        });
        var slider = $("#zoomSlider");
    });
});
//# sourceMappingURL=main.js.map