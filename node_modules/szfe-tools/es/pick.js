import pickBy from './pickBy';
/**
 * [过滤对象属性] 挑选处一个对象中的指定属性
 * @param {Object} obj 数据源对象
 * @param {Array} keys
 */

var pick = function pick(obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object.keys(obj);
  return pickBy(obj, function (value, key) {
    return keys.includes(key);
  });
};

export default pick;