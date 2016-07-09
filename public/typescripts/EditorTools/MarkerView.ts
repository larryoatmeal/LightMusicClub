import {Marker} from "./MarkerUtils";
import {Dimensions} from "../Util/dimensions";
import {CSSUtil} from "../Util/css";
import {WavesurferMarkerManager} from "./MarkerManager";

interface WavesurferMarkerParams{
    containerSelector: string;
    markersInHeight?: number;
    snapVertical?: boolean;
}


export class WavesurferMarkerView{
    style = WaveSurfer.Drawer.style;//helper method to apply css styles
    ws: any;
    wrapper: any;
    pxPerSec: number;
    container: string;
    params: WavesurferMarkerParams;
    constructor(ws: any, paramsInput: WavesurferMarkerParams){
        this.ws = ws;
        this.wrapper = ws.drawer.wrapper;

        //provide default parameters
        this.params = this.cleanparams(paramsInput);

        this.container = this.params.containerSelector;
    }

    private cleanparams(paramsInput): WavesurferMarkerParams {
        return {
            containerSelector: paramsInput.containerSelector,
            markersInHeight: paramsInput.markersInHeight ? paramsInput.markersInHeight : 10,
            snapVertical: paramsInput.snapVertical ? true : false
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

    getPosition(start: number, pxPerSec: number){
        return  ~~(start / this.ws.getDuration() * this.getWidth(pxPerSec))
    }
    getPositionPx(start: number, pxPerSec: number){
        return this.getPosition(start, pxPerSec) + "px"
    }

    static getMarker(id: string) {
        return document.getElementById(id);
    }

    getMarkerHeightInPercent() : string{
        return 100/this.params.markersInHeight + "%";
    }
    update(marker: Marker, markerDOM: any, pixPerSec?: number){
        marker.title = marker.meta.key + " " + marker.meta.title;
        let params = {
            position: 'absolute',
            zIndex: 2,
            height: this.getMarkerHeightInPercent(),
            //left:  '50px',
            left:  this.getPositionPx(marker.start, pixPerSec),
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