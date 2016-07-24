import {WavesurferMarkerManager} from "./MarkerManager";
import {WavesurferMarkerView} from "./MarkerView";
import {Marker} from "./MarkerUtils";
export class MarkerController{

    model: WavesurferMarkerManager;
    view: WavesurferMarkerView;


    constructor(model:WavesurferMarkerManager, view: WavesurferMarkerView) {
        this.model = model;
        this.view = view;

        //$(view.params.containerSelector).on("markerUpdatePos", (event, id, pos) => {
        //    console.log("Received marker update event");
        //    console.log(id);
        //    console.log(pos);
        //});
        this.setupInterconnects();
    }

    setupInterconnects(){
       this.view.obs.on(WavesurferMarkerView.OnMarkerMoved, (id: string, time: number, verticalPosPercent: number) => {
            console.log("RECEIVED: " + id);
           console.log(time);
           //console.log(pos);
            this.model.updateTime(id, time);
       });
    }

    remove(id: string){
        this.model.remove(id);
        this.view.remove(id);
    }

    add(){
        let id = this.model.addAtCurrent();
        this.view.add(this.model.markers[id], id);
    }
    //called when manual change
    //syncViewToModel(id: string, marker: Marker){
    //    this.view.update(id, marker);
    //}

    syncModelToView(id: string, params: any){
        let marker = this.model.markers[id];
        //Modify marker to match the params

        //Optionally
        //resyncViewToModel();
    }

}