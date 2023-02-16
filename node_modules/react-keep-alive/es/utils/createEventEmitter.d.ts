declare type Listener = (...args: any) => void;
export default function createEventEmitter(): {
    on: (eventNames: string | string[], listener: Listener, direction?: boolean) => void;
    off: (eventNames: string | string[], listener: Listener) => void;
    emit: (eventNames: string | string[], ...args: any) => void;
    clear: () => void;
    listenerCount: (eventNames: string | string[]) => number;
    removeAllListeners: (eventNames: string | string[]) => void;
};
export {};
