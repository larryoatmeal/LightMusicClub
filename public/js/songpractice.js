var audioRoot = "uploads/audio/";
var metaRoot = "uploads/meta/";
/**
 * Created by Larry on 11/9/16.
 */
var spinSemaphore = 0;
var looping = false;
var songList;
var currentMeasureTimes = [];
var songReady = false;

$(document).ready(function(){

    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        scrollParent: true,
        pixelRatio: 1
    });
    wavesurfer.enableDragSelection({});

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

    Mousetrap.bind("space", function(event){
        wavesurfer.playPause();
    });

    $("#playBtn").on("click", function(){
        if(songReady){
            wavesurfer.play();
        }
    });
    $("#pauseBtn").on("click", function(){
        wavesurfer.pause();
    });
    $("#beginBtn").on("click", function(){
        if(wavesurfer.isPlaying()){//if playing, restart
            wavesurfer.stop();
            wavesurfer.play();
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

    function changeSong(songnum){
        songReady = false;
        startTask();
        if(songList){
            var song = songList[songnum];
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

        console.log("MEASURE");
        console.log(startMeasure);
        console.log(endMeasure);

        var startTime = measureToTime(startMeasure);
        var endTime = measureToTime(endMeasure+1);//make it inclusive

        console.log(startTime);
        console.log(endTime);

        return [startTime, endTime];
        //if(isNaN(startMeasureStr) || isNaN(endMeasureStr)){
        //    return [0, ];
        //}else{
        //
        //
        //}
    }

    function pollTime() {
        if(looping && wavesurfer.isPlaying()){
            var time = wavesurfer.getCurrentTime();
            console.log(time);
            var se = startAndEndTimes();
            var start = se[0];
            var end = se[1];

            if(time < start || time > end){
                wavesurfer.pause();
                wavesurfer.seekTo(start/wavesurfer.getDuration());
                wavesurfer.play();
            }
        }
    }
    setInterval(pollTime, 50);

    wavesurfer.on('ready', function () {

        songReady = true;
        endTask();
    });

});