//From wavesurfer.observer
export class Observer {
    handlers: { [event: string]: any[]} = {};
    constructor() {
    }
    /**
     * Attach a handler function for an event.
     */

    on (event: string, fn: any) {
        if (!this.handlers) { this.handlers = {}; }

        var handlers = this.handlers[event];
        if (!handlers) {
            handlers = this.handlers[event] = [];
        }
        handlers.push(fn);

        // Return an event descriptor
        return {
            name: event,
            callback: fn,
            un: this.un.bind(this, event, fn)
        };
    }

    /**
     * Remove an event handler.
     */
    un (event: string, fn: any) {
        if (!this.handlers) { return; }

        var handlers = this.handlers[event];
        if (handlers) {
            if (fn) {
                for (var i = handlers.length - 1; i >= 0; i--) {
                    if (handlers[i] == fn) {
                        handlers.splice(i, 1);
                    }
                }
            } else {
                handlers.length = 0;
            }
        }
    }

    /**
     * Remove all event handlers.
     */
    unAll () {
        this.handlers = null;
    }

    /**
     * Attach a handler to an event. The handler is executed at most once per
     * event type.
     */
    once (event: string, handler: any) {
        var my = this;
        var fn = function () {
            handler.apply(this, arguments);
            setTimeout(function () {
                my.un(event, fn);
            }, 0);
        };
        return this.on(event, fn);
    }

    fireEvent (event: string, ...args: any[]) {
        if (!this.handlers) { return; }
        var handlers = this.handlers[event];

        var args2 = Array.prototype.slice.call(arguments, 1);
        console.log(args2);
        handlers && handlers.forEach(function (fn) {
            fn.apply(null, args2);
        });
    }
}