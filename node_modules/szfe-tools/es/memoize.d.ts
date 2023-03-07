export interface CachedFunction extends Function {
    cache: Map<any, any>;
}
/**
 * [缓存函数结果]
 * @param {Function} func 被处理的函数
 */
declare const memoize: <T>(func: Function, { disable }?: {
    disable?: () => false;
}) => CachedFunction;
export default memoize;
