import {Marker} from "./MarkerUtils";
import {Dimensions} from "../Util/dimensions";
import {CSSUtil} from "../Util/css";
import {WavesurferMarkerManager} from "./MarkerManager";
import {Observer} from "../Util/observer";
declare var WaveSurfer: any;
interface WavesurferMarkerParams{
    containerSelector: string;
    markersInHeight?: number;
    snapVertical?: boolean;
    pxPerSec? : number;
}


export class WavesurferMarkerView{

    public static OnMarkerMoved: string = "MarkerMoved";

    style = WaveSurfer.Drawer.style;//helper method to apply css styles
    ws: any;
    wrapper: any;
    pxPerSec: number;
    container: string;
    params: WavesurferMarkerParams;
    obs: Observer = new Observer();
    constructor(ws: any, paramsInput: WavesurferMarkerParams){
        this.ws = ws;
        this.wrapper = ws.drawer.wrapper;

        //provide default parameters
        this.params = this.cleanparams(paramsInput);

        this.container = this.params.containerSelector;
    }

    private cleanparams(paramsInput: WavesurferMarkerParams): WavesurferMarkerParams {
        return {
            containerSelector: paramsInput.containerSelector,
            markersInHeight: paramsInput.markersInHeight ? paramsInput.markersInHeight : 10,
            snapVertical: paramsInput.snapVertical,
            pxPerSec: paramsInput.pxPerSec
        };
    };
    static getAllMarkers(id: string) {
        return document.getElementsByTagName("marker");
    }
    zoom(){

    }

    getWidth(pxPerSec: number){
        let width: number;
        if (pxPerSec) {
            width = Math.round(this.ws.getDuration() * pxPerSec);
        }
        else {
            width = this.wrapper.scrollWidth;
        }
        return width;
    }

    getPosition(start: number, pxPerSec: number): number{
        return  ~~(start / this.ws.getDuration() * this.getWidth(pxPerSec))
    }
    getPositionPx(start: number, pxPerSec: number): string{
        return this.getPosition(start, pxPerSec) + "px"
    }
    getTimeForPosition(left: number, pxPerSec: number): number{
        return left / this.getWidth(pxPerSec) * this.ws.getDuration();
    }

    static getMarker(id: string) {
        return document.getElementById(id);
    }

    getMarkerHeightInPercent() : string{
        return 100/this.params.markersInHeight + "%";
    }
    update(marker: Marker, markerDOM: any){
        markerDOM.title = marker.meta.key + " " + marker.meta.title;
        let params: any = {
            position: 'absolute',
            zIndex: 2,
            height: this.getMarkerHeightInPercent(),
            //left:  '50px',
            left:  this.getPositionPx(marker.start, this.params.pxPerSec),
            top: '0px',
            width: '10px'};

        if(marker.img){
            params["backgroundImage"] = marker.img;
        }
        else if(marker.color){
            params["backgroundColor"] = marker.color;
        }
        else{
            const defaultColor = 'rgba(100, 204, 102, 0.8)';
            params["backgroundColor"] = defaultColor;
        }
        //var width = this.wrapper.scrollWidth;
        this.style(markerDOM, params);
    }

    genDOM(marker: Marker, id: string){
        let markerEl = document.createElement('marker');
        markerEl.className = 'marker';
        markerEl.setAttribute('data-id', id);

        //dragging
        $(markerEl).draggable(
            { containment: "parent" }
        );

        //let [canvasW, canvasH] = this.getCanvasDim();
        let canvasH = this.getCanvasDim().h;

        $(markerEl).on("drag", (event, ui) => {
           //let [top, left] = ui.position;
            //console.log(pos);
            //
            console.log({
                y  : ui.position.top,
                clientHeight: markerEl.clientHeight,
                canvasH: canvasH
            });

            //ui.position.left = 50;
            ui.position.top = Math.min(ui.position.top, canvasH - markerEl.clientHeight);
            if(this.params.snapVertical){
                let gridDistance = canvasH / this.params.markersInHeight;
                console.log(gridDistance);

                ui.position.top = ui.position.top - ui.position.top % gridDistance;


            }
            //
            //if((ui.position.top + markerEl.clientHeight) > canvasH) {
            //    console.log("OVERFLOW");
            //    ui.position.top = CSSUtil.pixify(canvasH - markerEl.clientHeight);
            //}
        });

        $(markerEl).on("dragstop", (event, ui) => {
            let time = this.getTimeForPosition(ui.position.left, this.params.pxPerSec);
            console.log(time);
            //use container as message broker
            //$(this.params.containerSelector).trigger("markerUpdatePos", [id, ui.position]);
            let verticalPosPercent: number = ui.position.top / canvasH;
            this.obs.fireEvent(WavesurferMarkerView.OnMarkerMoved, id, time, verticalPosPercent);
        });

        //For example, on zoom, need to restyle
        $(markerEl).on("markerGlobalUpdate", (event) => {
            this.update(marker, markerEl);
        });

        this.update(marker, markerEl);
        return markerEl;
    }

    getCanvasDim(): Dimensions{
        let canvas = this.getCanvas();
        return {
            w: canvas.width(),
            h: canvas.height()
        }
    }

    getCanvas() {
        return $(this.container).find("canvas");
    }


    add(marker: Marker, id: string){
        console.log(this.wrapper);
        this.wrapper.appendChild(this.genDOM(marker, id));
    }
    remove(id: string){
        this.wrapper.removeChild(document.getElementById(id));
    }
}