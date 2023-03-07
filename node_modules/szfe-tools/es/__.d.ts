declare type AnyFunction = (...args: any[]) => any;
declare const __: <T extends AnyFunction>(func: T, context?: any) => (...preArgs: any[]) => (...args: any[]) => ReturnType<T>;
export default __;
