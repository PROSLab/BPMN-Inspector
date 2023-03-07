/**
 * [用来智能处理Promise类型返回值]
 * 当值生成过程为 promise 时，将得到 promise 类型返回值，按约定 resolve 最终值
 * 当过程不为 promise 时将直接得到值
 * @param {Function} executor 执行过程获取
 * @param {Function} valuer 值处理过程
 */
declare const promiseGuess: <T>(executor: Function, valuer: Function) => (...args: any[]) => T;
export default promiseGuess;
