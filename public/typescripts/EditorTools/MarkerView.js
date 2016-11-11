define(["require", "exports", "../Util/observer"], function (require, exports, observer_1) {
    var WavesurferMarkerView = (function () {
        function WavesurferMarkerView(ws, paramsInput) {
            this.style = WaveSurfer.Drawer.style;
            this.obs = new observer_1.Observer();
            this.ws = ws;
            this.wrapper = ws.drawer.wrapper;
            this.params = this.cleanparams(paramsInput);
            this.container = this.params.containerSelector;
        }
        WavesurferMarkerView.prototype.cleanparams = function (paramsInput) {
            return {
                containerSelector: paramsInput.containerSelector,
                markersInHeight: paramsInput.markersInHeight ? paramsInput.markersInHeight : 10,
                snapVertical: paramsInput.snapVertical,
                pxPerSec: paramsInput.pxPerSec
            };
        };
        ;
        WavesurferMarkerView.getAllMarkers = function (id) {
            return document.getElementsByTagName("marker");
        };
        WavesurferMarkerView.prototype.zoom = function () {
        };
        WavesurferMarkerView.prototype.getWidth = function (pxPerSec) {
            var width;
            if (pxPerSec) {
                width = Math.round(this.ws.getDuration() * pxPerSec);
            }
            else {
                width = this.wrapper.scrollWidth;
            }
            return width;
        };
        WavesurferMarkerView.prototype.getPosition = function (start, pxPerSec) {
            return ~~(start / this.ws.getDuration() * this.getWidth(pxPerSec));
        };
        WavesurferMarkerView.prototype.getPositionPx = function (start, pxPerSec) {
            return this.getPosition(start, pxPerSec) + "px";
        };
        WavesurferMarkerView.prototype.getTimeForPosition = function (left, pxPerSec) {
            return left / this.getWidth(pxPerSec) * this.ws.getDuration();
        };
        WavesurferMarkerView.getMarker = function (id) {
            return document.getElementById(id);
        };
        WavesurferMarkerView.prototype.getMarkerHeightInPercent = function () {
            return 100 / this.params.markersInHeight + "%";
        };
        WavesurferMarkerView.prototype.update = function (marker, markerDOM) {
            markerDOM.title = marker.meta.key + " " + marker.meta.title;
            var params = {
                position: 'absolute',
                zIndex: 2,
                height: this.getMarkerHeightInPercent(),
                left: this.getPositionPx(marker.start, this.params.pxPerSec),
                top: '0px',
                width: '10px' };
            if (marker.img) {
                params["backgroundImage"] = marker.img;
            }
            else if (marker.color) {
                params["backgroundColor"] = marker.color;
            }
            else {
                var defaultColor = 'rgba(100, 204, 102, 0.8)';
                params["backgroundColor"] = defaultColor;
            }
            this.style(markerDOM, params);
        };
        WavesurferMarkerView.prototype.genDOM = function (marker, id) {
            var _this = this;
            var markerEl = document.createElement('marker');
            markerEl.className = 'marker';
            markerEl.setAttribute('data-id', id);
            $(markerEl).draggable({ containment: "parent" });
            var canvasH = this.getCanvasDim().h;
            $(markerEl).on("drag", function (event, ui) {
                console.log({
                    y: ui.position.top,
                    clientHeight: markerEl.clientHeight,
                    canvasH: canvasH
                });
                ui.position.top = Math.min(ui.position.top, canvasH - markerEl.clientHeight);
                if (_this.params.snapVertical) {
                    var gridDistance = canvasH / _this.params.markersInHeight;
                    console.log(gridDistance);
                    ui.position.top = ui.position.top - ui.position.top % gridDistance;
                }
            });
            $(markerEl).on("dragstop", function (event, ui) {
                var time = _this.getTimeForPosition(ui.position.left, _this.params.pxPerSec);
                console.log(time);
                var verticalPosPercent = ui.position.top / canvasH;
                _this.obs.fireEvent(WavesurferMarkerView.OnMarkerMoved, id, time, verticalPosPercent);
            });
            $(markerEl).on("markerGlobalUpdate", function (event) {
                _this.update(marker, markerEl);
            });
            this.update(marker, markerEl);
            return markerEl;
        };
        WavesurferMarkerView.prototype.getCanvasDim = function () {
            var canvas = this.getCanvas();
            return {
                w: canvas.width(),
                h: canvas.height()
            };
        };
        WavesurferMarkerView.prototype.getCanvas = function () {
            return $(this.container).find("canvas");
        };
        WavesurferMarkerView.prototype.add = function (marker, id) {
            console.log(this.wrapper);
            this.wrapper.appendChild(this.genDOM(marker, id));
        };
        WavesurferMarkerView.prototype.remove = function (id) {
            this.wrapper.removeChild(document.getElementById(id));
        };
        WavesurferMarkerView.OnMarkerMoved = "MarkerMoved";
        return WavesurferMarkerView;
    })();
    exports.WavesurferMarkerView = WavesurferMarkerView;
});
//# sourceMappingURL=MarkerView.js.map