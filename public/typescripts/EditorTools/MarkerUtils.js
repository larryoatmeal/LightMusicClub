define(["require", "exports"], function (require, exports) {
    var MarkerFactory = (function () {
        function MarkerFactory() {
        }
        MarkerFactory.createMarker = function (meta, start) {
            return {
                start: start,
                meta: meta
            };
        };
        MarkerFactory.createMarkerDefault = function (start) {
            return {
                start: start,
                meta: MarkerFactory.createDefaultMarkerMeta()
            };
        };
        MarkerFactory.dateString = function () {
            return new Date().toLocaleString();
        };
        MarkerFactory.createDefaultMarkerMeta = function () {
            return {
                key: MarkerFactory.dateString(),
                tags: []
            };
        };
        return MarkerFactory;
    })();
    exports.MarkerFactory = MarkerFactory;
});
//# sourceMappingURL=MarkerUtils.js.map