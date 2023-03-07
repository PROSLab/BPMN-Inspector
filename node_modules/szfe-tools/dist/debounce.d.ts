declare type AnyFunction = (...args: any[]) => any;
/**
 * [防抖]
 * @param {Function} func 执行函数
 * @param {Number} wait 多少毫秒后运行一次
 */
declare const debounce: <T extends AnyFunction>(func: T, wait?: number) => (...args: any[]) => void | ReturnType<T>;
export default debounce;
