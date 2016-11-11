define(["require", "exports"], function (require, exports) {
    var Alerter = (function () {
        function Alerter(message) {
            this.greeting = message;
        }
        Alerter.prototype.greet = function () {
            return "dedede" + this.greeting;
        };
        return Alerter;
    })();
    exports.Alerter = Alerter;
});
//# sourceMappingURL=alert.js.map