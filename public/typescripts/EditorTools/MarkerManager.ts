
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
    //returns id of created
    addAtCurrent(meta?: MarkerMeta): string{
        if(meta){
            return this.add(MarkerFactory.createMarker(meta, this.currentTime()));
        }
        else{
            return this.add(MarkerFactory.createMarkerDefault(this.currentTime()));
        }
    }
    add(marker: Marker): string{
        var id = UID.generate();
        this.markers[id] = marker;
        return id;
    }
    updateTime(id: string, time: number){
        this.markers[id].start = time;
    }


    remove(id: string){
        delete this.markers[id];
    }
    log(){
        return this.markers;
    }
}

