define(["require", "exports"], function (require, exports) {
    var Observer = (function () {
        function Observer() {
            this.handlers = {};
        }
        Observer.prototype.on = function (event, fn) {
            if (!this.handlers) {
                this.handlers = {};
            }
            var handlers = this.handlers[event];
            if (!handlers) {
                handlers = this.handlers[event] = [];
            }
            handlers.push(fn);
            return {
                name: event,
                callback: fn,
                un: this.un.bind(this, event, fn)
            };
        };
        Observer.prototype.un = function (event, fn) {
            if (!this.handlers) {
                return;
            }
            var handlers = this.handlers[event];
            if (handlers) {
                if (fn) {
                    for (var i = handlers.length - 1; i >= 0; i--) {
                        if (handlers[i] == fn) {
                            handlers.splice(i, 1);
                        }
                    }
                }
                else {
                    handlers.length = 0;
                }
            }
        };
        Observer.prototype.unAll = function () {
            this.handlers = null;
        };
        Observer.prototype.once = function (event, handler) {
            var my = this;
            var fn = function () {
                handler.apply(this, arguments);
                setTimeout(function () {
                    my.un(event, fn);
                }, 0);
            };
            return this.on(event, fn);
        };
        Observer.prototype.fireEvent = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this.handlers) {
                return;
            }
            var handlers = this.handlers[event];
            var args2 = Array.prototype.slice.call(arguments, 1);
            console.log(args2);
            handlers && handlers.forEach(function (fn) {
                fn.apply(null, args2);
            });
        };
        return Observer;
    })();
    exports.Observer = Observer;
});
//# sourceMappingURL=observer.js.map