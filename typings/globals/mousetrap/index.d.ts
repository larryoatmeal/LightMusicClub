// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/029077eefb038480667b78c3a4785864052bf7df/mousetrap/mousetrap.d.ts
interface ExtendedKeyboardEvent extends KeyboardEvent {
    returnValue: boolean; // IE returnValue
}

interface MousetrapStatic {
    (el: Element): MousetrapInstance;
    new (el: Element): MousetrapInstance;
    stopCallback: (e: ExtendedKeyboardEvent, element: Element, combo: string) => boolean;
    bind(keys: string|string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
    unbind(keys: string|string[], action?: string): void;
    trigger(keys: string, action?: string): void;
    reset(): void;
}

interface MousetrapInstance {
    stopCallback: (e: ExtendedKeyboardEvent, element: Element, combo: string) => boolean;
    bind(keys: string|string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
    unbind(keys: string|string[], action?: string): void;
    trigger(keys: string, action?: string): void;
    reset(): void;
}

declare var Mousetrap: MousetrapStatic;

declare module "mousetrap" {
    export = Mousetrap;
}