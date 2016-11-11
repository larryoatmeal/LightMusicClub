define(["require", "exports", "./MarkerView"], function (require, exports, MarkerView_1) {
    var MarkerController = (function () {
        function MarkerController(model, view) {
            this.model = model;
            this.view = view;
            this.setupInterconnects();
        }
        MarkerController.prototype.setupInterconnects = function () {
            var _this = this;
            this.view.obs.on(MarkerView_1.WavesurferMarkerView.OnMarkerMoved, function (id, time, verticalPosPercent) {
                console.log("RECEIVED: " + id);
                console.log(time);
                _this.model.updateTime(id, time);
            });
        };
        MarkerController.prototype.remove = function (id) {
            this.model.remove(id);
            this.view.remove(id);
        };
        MarkerController.prototype.add = function () {
            var id = this.model.addAtCurrent();
            this.view.add(this.model.markers[id], id);
        };
        MarkerController.prototype.syncModelToView = function (id, params) {
            var marker = this.model.markers[id];
        };
        return MarkerController;
    })();
    exports.MarkerController = MarkerController;
});
//# sourceMappingURL=MarkerController.js.map