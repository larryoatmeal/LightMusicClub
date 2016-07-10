


import NumberFormat = Intl.NumberFormat;
import {UID} from "../Util/uid";
import {MarkerMeta} from "./MarkerUtils";
import {Marker} from "./MarkerUtils";
import {WavesurferMarkerView} from "./MarkerView";
import {WavesurferMarkerManager} from "./MarkerManager";
import {MarkerController} from "./MarkerController";
const endpoint = "http://localhost:8080/";
//var endpoint = "http://localhost:8080/";
const audioRoot = "uploads/audio/";

declare var WaveSurfer: any;
$(document).ready(function() {

    var id = $("#_id").val();
    var audioPath = $("#audioPath").val();

    console.log(id);
    console.log(audioPath);

    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        scrollParent: true,
        height: 256
    });
    //wavesurfer.enableDragSelection({});
    wavesurfer.load(audioRoot + audioPath);

    $("#btnPlay").click(function(ev){
        wavesurfer.playPause();
    });

    let markerManager = new WavesurferMarkerManager(wavesurfer);
    let markerView = new WavesurferMarkerView(wavesurfer, {containerSelector: "#waveform", snapVertical: true});

    let controller = new MarkerController(markerManager, markerView);



    Mousetrap.bind("space", (event) => {
        wavesurfer.playPause();
    });
    Mousetrap.bind("a", function(){
        console.log("Pressed a");
        console.log(wavesurfer.getCurrentTime());
        //markerManager.addAtCurrent();
        controller.add();
    });
    Mousetrap.bind("d", () => {
        console.log(markerManager.log())
    });
    Mousetrap.bind("f", () => {
       wavesurfer.params.autoCenter = !wavesurfer.params.autoCenter;
    });

    //Time independent marker data




    //class WavesurferMarker{
    //    wavesurfer;
    //    duration: Number;
    //
    //    constructor(ws) {
    //        this.wavesurfer = ws;
    //    }
    //    init(){
    //        this.duration = wavesurfer.getDuration();
    //    }
    //
    //    eventToTime(event){
    //        return wavesurfer.drawer.handleEvent(event) * this.duration;
    //    }
    //
    //    onDown(e) {
    //        e.stopPropagation();
    //        var time = this.eventToTime(e);
    //
    //        if(e.target.tagName.toLowerCase() == 'marker'){
    //
    //        }
    //        if (e.target.tagName.toLowerCase() == 'handle') {
    //            if (e.target.classList.contains('wavesurfer-handle-start')) {
    //                resize = 'start';
    //            } else {
    //                resize = 'end';
    //            }
    //        } else {
    //            drag = true;
    //        }
    //    };




    //}


    //let wrapper = wavesurfer.wrapper;
    //let onDown = function (e) {
    //    e.stopPropagation();
    //    var time = wavesurfer.drawer.handleEvent(e) * duration;
    //
    //    if (e.target.tagName.toLowerCase() == 'handle') {
    //        if (e.target.classList.contains('wavesurfer-handle-start')) {
    //            resize = 'start';
    //        } else {
    //            resize = 'end';
    //        }
    //    } else {
    //        drag = true;
    //    }
    //};
    //let eventToTime = function(event){
    //    return wavesurfer.drawer.handleEvent(event) * duration;
    //};



    var slider = $("#zoomSlider");




});