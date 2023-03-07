export default class EventBus {
    private listeners;
    private getEventMap;
    on: (event: string, listener: Function, { once }?: {
        once?: boolean;
    }) => this;
    once: (event: string, listener: Function, config?: {}) => this;
    off: (event: string, listener: Function) => this;
    emit: (event: string, ...args: any[]) => void;
}
