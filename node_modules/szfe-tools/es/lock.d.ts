import { CachedFunction } from './memoize';
export interface LockedFunction extends Function {
    unlock: () => void;
    isLocked: () => boolean;
}
export interface LockConfig {
    always?: Function;
    locking?: Function;
}
/**
 * [自锁函数] 函数运行后会立即上锁，显式调用 fn.unlock 来解锁
 * 已上锁后，后续的函数调用将返回上锁时的调用结果
 * @param {Function} func 需要自锁的函数
 * @param {Function} conf.always 总是会调用
 * @param {Function} conf.locking 自锁时调用
 */
declare const lock: {
    <T>(func: any, conf?: LockConfig): LockedFunction;
    memory: CachedFunction;
};
export default lock;
