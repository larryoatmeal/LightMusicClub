define(["require", "exports"], function (require, exports) {
    var IntervalViewer = (function () {
        function IntervalViewer(intervals, eventListener) {
            this.events = intervals;
            this.currentEndIndex = 0;
            this.currentStartIndex = 0;
            this.eventListener = eventListener;
        }
        IntervalViewer.prototype.findIndexOfFirstAfter = function (time) {
            var i = this.currentStartIndex;
            var numIntervals = this.events.length;
            while (i < numIntervals) {
                var interval = this.events[i];
                if (interval.startTime > time) {
                    return i;
                }
            }
            return -1;
        };
        IntervalViewer.prototype.findIndexOfLastBefore = function (time) {
            var i = this.currentEndIndex;
            var numIntervals = this.events.length;
            while (i < numIntervals) {
                var interval = this.events[i];
                if (interval.startTime > time) {
                    return Math.max(i - 1, 0);
                }
            }
        };
        IntervalViewer.prototype.seekForwardIncremental = function (time, window) {
            var newStartIndex = this.findIndexOfFirstAfter(time);
            var newEndIndex = this.findIndexOfLastBefore(time + window);
        };
        return IntervalViewer;
    })();
    exports.IntervalViewer = IntervalViewer;
});
//# sourceMappingURL=IntervalViewer.js.map