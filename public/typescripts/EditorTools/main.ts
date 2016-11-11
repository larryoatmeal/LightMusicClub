


import NumberFormat = Intl.NumberFormat;
import {UID} from "../Util/uid";
import {MarkerMeta} from "./MarkerUtils";
import {Marker} from "./MarkerUtils";
import {WavesurferMarkerView} from "./MarkerView";
import {WavesurferMarkerManager} from "./MarkerManager";
import {MarkerController} from "./MarkerController";
import {Bst} from "../bst";
import {Node} from "../bst";
import {Interval} from "../bst";
const endpoint = "http://localhost:8080/";
//var endpoint = "http://localhost:8080/";
const audioRoot = "uploads/audio/";

declare var WaveSurfer: any;

//var bst: Bst = new Bst(true);
//window.bst = bst;
//var intervals: Interval[] = [];
//
//var numKeys = 10000;
//
//const windowLength = 10;
//for (var i = 0; i < numKeys; i++){
//    var start = Math.round(Math.random() * 100);
//    var length = Math.round(Math.random() * windowLength);
//    //bst.insert(start, {"end": start + length, "maxEnd": start + length });
//    intervals.push({start: start, end: start+length});
//}
//
//intervals.sort(function(a: Interval,b: Interval){
//   return a.start - b.start;
//});
//
//bst.generateFromSortedList(intervals);
//
//var inorder = bst.inorder();
//
//if(inorder.length != numKeys){
//    console.log("BST NOT CORRECT SIZE");
//}
//
//function testSearch(n: number){
//    for(var i = 0; i < n; i++){
//        var testStart = Math.random() * 100;
//        var testEnd = testStart + Math.random() * windowLength;
//        var result = bst.searchIntervals(testStart, testEnd);
//    }
//}
//
//function testDumbSearch(n: number){
//    for(var i = 0; i < n; i++){
//        var results: Node[] = [];
//        var testStart = Math.random() * 100;
//        var testEnd = testStart + Math.random() * windowLength;
//        for(var j = 0; j < inorder.length; j++){
//
//            var interval: Node = inorder[j];
//            if(Bst.overlap(testStart, testEnd, interval.key, interval.data.end)){
//                results.push(interval)
//            }
//        }
//    }
//}
//
//
//console.time('testSearch');
//testSearch(10000);
//console.timeEnd('testSearch');
//
//console.time('testDumbSearch');
//testDumbSearch(10000);
//console.timeEnd('testDumbSearch');
//
//



//for (var i = 0; i < 10; i++){
//    var testStart = Math.random() * 100;
//    var testEnd = testStart + Math.random() * windowLength;
//
//    var result = bst.searchIntervals(testStart, testEnd);
//
//    var allIntervals: Node[] = bst.inorder();
//    var countOverlap = 0;
//    for(var j = 0; j < allIntervals.length; j++){
//        var interval: Node = allIntervals[j];
//        if(Bst.overlap(testStart, testEnd, interval.key, interval.data.end)){
//            countOverlap += 1;
//        }
//    }
//
//    if(countOverlap != result.length){
//        console.log("NOT THE SAME SIZE");
//        console.log(countOverlap);
//        console.log(result.length);
//    }else{
//        console.log("CORRECT");
//    }
//}


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
        wavesurfer.play();
    });
    $("#btnStop").click(function(ev){
       wavesurfer.pause();
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