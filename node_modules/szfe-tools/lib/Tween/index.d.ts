import EventBus from '../EventBus';
import { EasingFunctionMap } from './easing';
export default class Tween {
    static easing: EasingFunctionMap;
    static DEFAULT_CONFIG: {
        from: number;
        to: number;
        duration: number;
        ease: string;
        loop: boolean;
    };
    private stopRunningFrame?;
    bus: EventBus;
    state: {
        reversed: boolean;
        progress: number;
        stoped: boolean;
        config: {
            from: number;
            to: number;
            duration: number;
            ease: string;
            loop: boolean;
        };
    };
    constructor(config?: {
        from: number;
        to: number;
        duration: number;
        ease: string;
        loop: boolean;
    });
    on: (event: string, listeners: Function, ...args: any[]) => this;
    off: (event: string, listeners: Function) => this;
    config: (config?: {
        from: number;
        to: number;
        duration: number;
        ease: string;
        loop: boolean;
    }) => this;
    start: () => this;
    restart: () => this;
    reset: () => this;
    stop: () => this;
    reverse: () => this;
    progress: (progress: number) => this;
    value: (progress?: number) => number;
    isEnded: (progress?: number) => boolean;
}
