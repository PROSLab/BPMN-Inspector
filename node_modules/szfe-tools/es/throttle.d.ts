declare type AnyFunction = (...args: any[]) => any;
/**
 * [节流]
 * @param {Function} func 执行函数
 * @param {Number} wait 多少毫秒内运行一次
 */
declare const throttle: <T extends AnyFunction>(func: T, wait?: number) => (...args: any[]) => void | ReturnType<T>;
export default throttle;
