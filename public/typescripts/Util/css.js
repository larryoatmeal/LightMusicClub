define(["require", "exports"], function (require, exports) {
    var CSSUtil = (function () {
        function CSSUtil() {
        }
        CSSUtil.pixify = function (pix) {
            return pix + "px";
        };
        return CSSUtil;
    })();
    exports.CSSUtil = CSSUtil;
});
//# sourceMappingURL=css.js.map