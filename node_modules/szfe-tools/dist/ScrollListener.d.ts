export interface DistanceEventType {
    distance: number | Function;
    onGoingIn?: Function;
    onGoningOut: Function;
    dynamic?: boolean;
}
export interface ScrollListenerConfig {
    element: HTMLBaseElement;
    scrollHandler?: Function;
    getScrollDistance?: Function;
    distanceToReachEnd?: number;
    onEndReached?: Function;
    distanceEvents?: DistanceEventType[];
    direction?: 'vertical' | 'horizontal';
}
export default class ScrollListener {
    config: ScrollListenerConfig;
    getScrollDistance: Function;
    constructor(config: ScrollListenerConfig);
    destroy: () => any;
    init(): this;
    getEndReachedEvent(): {
        dynamic: boolean;
        distance: (() => number) | (() => number);
        onGoingOut: () => void;
    };
    dynamicEvents: any[];
    genDynamicEvents(): void;
    currentStaticEvent: any;
    staticEvents: any[];
    genStaticEvents(): void;
    walkEvent: (event: any, scrollDistance: any) => boolean;
    walkStaticEvent: ({ direction, scrollDistance }: {
        direction: any;
        scrollDistance: any;
    }) => void;
    walkDynamicEvents: ({ direction, scrollDistance }: {
        direction: any;
        scrollDistance: any;
    }) => void;
}
