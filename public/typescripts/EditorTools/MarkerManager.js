define(["require", "exports", "../Util/uid", "./MarkerUtils"], function (require, exports, uid_1, MarkerUtils_1) {
    var WavesurferMarkerManager = (function () {
        function WavesurferMarkerManager(ws) {
            this.markers = {};
            this.wavesurfer = ws;
            this.duration = ws.getDuration();
        }
        WavesurferMarkerManager.prototype.eventToTime = function (event) {
            return this.wavesurfer.drawer.handleEvent(event) * this.duration;
        };
        WavesurferMarkerManager.prototype.currentTime = function () {
            return this.wavesurfer.getCurrentTime();
        };
        WavesurferMarkerManager.prototype.addAtCurrent = function (meta) {
            if (meta) {
                return this.add(MarkerUtils_1.MarkerFactory.createMarker(meta, this.currentTime()));
            }
            else {
                return this.add(MarkerUtils_1.MarkerFactory.createMarkerDefault(this.currentTime()));
            }
        };
        WavesurferMarkerManager.prototype.add = function (marker) {
            var id = uid_1.UID.generate();
            this.markers[id] = marker;
            return id;
        };
        WavesurferMarkerManager.prototype.updateTime = function (id, time) {
            this.markers[id].start = time;
        };
        WavesurferMarkerManager.prototype.remove = function (id) {
            delete this.markers[id];
        };
        WavesurferMarkerManager.prototype.log = function () {
            return this.markers;
        };
        return WavesurferMarkerManager;
    })();
    exports.WavesurferMarkerManager = WavesurferMarkerManager;
});
//# sourceMappingURL=MarkerManager.js.map