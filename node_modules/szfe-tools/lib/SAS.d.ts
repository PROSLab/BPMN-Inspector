/**
 * [单咨询服务] Single Advisory Service 同一时刻对同一异步请求进行统一等待，不重复发起
 * @param {Function} query 异步查询函数，需要返回 Promise
 */
declare const SAS: <T>(query: () => Promise<T>) => () => Promise<T>;
export default SAS;
