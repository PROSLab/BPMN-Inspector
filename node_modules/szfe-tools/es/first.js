import isArray from './isArray';
import isObject from './isObject';
/**
 * [返回数组或对象的首个值]
 * @param {Array / Object} value 源集合
 */

var first = function first(value) {
  if (isArray(value)) {
    return value[0];
  }

  if (isObject(value)) {
    var keys = Object.keys(value);
    return value[first(keys)];
  }

  return undefined;
};

export default first;