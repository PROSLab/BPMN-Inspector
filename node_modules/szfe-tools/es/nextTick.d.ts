declare const nextTick: (func: (value: void) => void | PromiseLike<void>) => Promise<void>;
export default nextTick;
