var audioRoot = "uploads/audio/";
var metaRoot = "uploads/meta/";
var imageRoot = "uploads/images/";
/**
 * Created by Larry on 11/9/16.
 */
var spinSemaphore = 0;
var looping = false;
var songList;
var currentMeasureTimes = [];
var songReady = false;
var currentSong = {};

$(document).ready(function(){

    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        scrollParent: true,
        pixelRatio: 1,
        progressColor: "#3498DB"
    });
    //wavesurfer.enableDragSelection({});


    //wavesurfer.load(audioRoot + audioPath);

    function loadSongs(){
        startTask();
        $.get("/vgosongs", function( data ) {
            //console.log(data);
            songList = data;
            endTask();
            changeSong(0);
        });
    }

    Mousetrap.bind("p", function(event){
        wavesurfer.playplay();
    });

    $("#playBtn").on("click", function(){
        if(songReady){
            play();
            //wavesurfer.softPlay(0.2);
        }
    });
    $("#pauseBtn").on("click", function(){
        pause();
    });
    $("#beginBtn").on("click", function(){
        if(wavesurfer.isPlaying()){//if playing, restart
            wavesurfer.stop();
            //wavesurfer.play();
            play();
        }else{
            wavesurfer.stop();
        }
    });

    $("#loopToggle").on("click", function(){
        console.log("HELLO");
        const inactiveClass = "inactive";
        var button = $(this);
        if(button.hasClass(inactiveClass)){
            button.removeClass(inactiveClass);
            looping = true;
        }else{
            button.addClass(inactiveClass);
            looping = false;
        }
    });

    $("li").on("click", function(){
        //console.log(this);
        const sognNumAttribute = "songnum";
        var songNum = $(this).attr(sognNumAttribute);
        //console.log(songNum);
        changeSong(songNum);
    });

    $("#songDropdown").change(function(){
        var songNum = $(this).val();
        changeSong(songNum);
    });



    loadSongs();

    function startTask(){
        //spinSemaphore += 1;
        $("#mainSpinner").show();
        //console.log("SHOWING");
    }
    function endTask(){
        //console.log("ENDING");
        //spinSemaphore -= 1;
        //console.log(spinSemaphore);
        //if(spinSemaphore == 0){
        //    $("#mainSpinner").hide();
        //    console.log("HIDING");
        //}
        $("#mainSpinner").hide();

    }

    function convertMeasureMap(measureMap){
        var measureTimes = [];
        var m = 1;

        while(measureMap[m] != null){
            console.log("IN");
            measureTimes.push(measureMap[m]);
            m += 1;
        }
        return measureTimes;
    }

    function loadImage(imagePath){
        $("#mainImage").attr("src", imagePath);
    }


    function changeSong(songnum){
        songReady = false;
        startTask();
        if(songList){

            var song = songList[songnum];
            currentSong = song;
            console.log(songList[songnum]);

            var measureMap = song.measureJson;

            console.log(metaRoot + measureMap);
            $.getJSON(metaRoot + measureMap, function(data){
                currentMeasureTimes = convertMeasureMap(data);
                console.log(data);
                console.log(currentMeasureTimes);
                var songPath = audioRoot + song.audio;
                console.log(songPath);

                wavesurfer.load(songPath);

                if(song.background){
                    var imagePath = imageRoot + song.background;
                    loadImage(imagePath);
                }

                $("#songtitle").text(song.name);
            });


        }else{
            endTask();
        }
    }

    function measureToTime(m){
        var m0based = m - 1;

        if(m0based < 0){
            return 0
        }
        else if(m0based > currentMeasureTimes.length - 1) {
            return wavesurfer.getDuration();
        }else{
            return currentMeasureTimes[m0based];
        }
    }

    const startMeasureDOM = $("#startMeasure");
    const endMeasureDOM = $("#endMeasure");

    function startAndEndTimes(){
        var startMeasureStr =startMeasureDOM.val();
        var endMeasureStr =endMeasureDOM.val();
        console.log("MEASURE STR");
        console.log(startMeasureStr);
        console.log(endMeasureStr);

        var startMeasure = 0;
        if(isNaN(startMeasureStr) || !startMeasureStr){
            console.log("HERE");
            startMeasure = 0;
        }else{
            startMeasure = parseInt(startMeasureStr);
        }

        var endMeasure = currentMeasureTimes.length;
        if(isNaN(endMeasureStr) ||!endMeasureStr){
            endMeasure = currentMeasureTimes.length;
        }else{
            endMeasure = parseInt(endMeasureStr);
        }

        //console.log("MEASURE");
        console.log(modifyForRepeat(startMeasure));
        console.log(modifyForRepeat(endMeasure));

        if(startMeasure < endMeasure){
            var startTime = measureToTime(modifyForRepeat(startMeasure));
            var endTime = measureToTime(modifyForRepeat(endMeasure));//make it inclusive



            //console.log(startTime);
            //console.log(endTime);

            return [startTime, endTime];
        }else{
            return null;
        }
        //if(isNaN(startMeasureStr) || isNaN(endMeasureStr)){
        //    return [0, ];
        //}else{
        //
        //
        //}
    }

    //TODO Replace with json
    function modifyForRepeat(measure){
        if(currentSong.name == "Coldman"){
            if(measure > 2){
                console.log(measure + 2);
                return measure + 2;
            }else{
                return measure;
            }
        }
        else if(currentSong.name == "Zelda's Revenge"){
            if(measure > 4){
                console.log("HERE");

                return measure + 12;
            }else{
                return measure;
            }
        }else{
            return measure
        }


    }


    var play = function () {
        wavesurfer.softPlay(0.05);
    };

    var pause = function(){
        wavesurfer.softPause(0.005, 0.01);
    };

    var stop = function(){
        wavesurfer.softStop(0.1);
    };


    function pollTime() {
        //console.log(wavesurfer.backend.getVolume());
        if(looping && wavesurfer.isPlaying()){
            var time = wavesurfer.getCurrentTime();
            console.log(time);
            var se = startAndEndTimes();
            if(se){
                var start = se[0];
                var end = se[1];

                if(time < start || time > end){
                    pause();
                    //wavesurfer.seekTo(start/wavesurfer.getDuration());
                    //play();

                    setTimeout(function(){
                        //do what you need here
                        wavesurfer.seekTo(start/wavesurfer.getDuration());
                        play();
                    }, 50);

                }
            }
        }
    }


    setInterval(pollTime, 50);

    wavesurfer.on('ready', function () {
        songReady = true;
        endTask();
    });

    wavesurfer.on('finish', function(){
        if(looping){
            if(startMeasureDOM.val() == "" && endMeasureDOM.val() == ""){
                play();
            }
        }
    });

});