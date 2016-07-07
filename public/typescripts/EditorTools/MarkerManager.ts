
import {UID} from "../Util/uid";
import {Marker} from "./MarkerUtils";
import {MarkerFactory} from "./MarkerUtils";
import {MarkerMeta} from "./MarkerUtils";
export class WavesurferMarkerManager{
    wavesurfer: any;
    markers: {[id: string]: Marker} = {};
    duration : number;
    eventToTime(event: any){
        return this.wavesurfer.drawer.handleEvent(event) * this.duration;
    }
    constructor(ws: any) {
        this.wavesurfer = ws;
        this.duration = ws.getDuration();
    }
    currentTime(){
        return this.wavesurfer.getCurrentTime();
    }
    addAtCurrent(meta?: MarkerMeta){
        if(meta){
            this.add(MarkerFactory.createMarker(meta, this.currentTime()));
        }
        else{
            this.add(MarkerFactory.createMarkerDefault(this.currentTime()));
        }
    }
    add(marker: Marker){
        this.markers[UID.generate()] = marker;
    }
    log(){
        return this.markers;
    }
}