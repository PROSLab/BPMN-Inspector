import isArray from './isArray';
import isObject from './isObject';
/**
 * [返回数组或对象的末尾值]
 * @param {Array / Object} value 源集合
 */

var last = function last(value) {
  if (isArray(value)) {
    return value[value.length - 1];
  }

  if (isObject(value)) {
    var keys = Object.keys(value);
    return value[last(keys)];
  }

  return undefined;
};

export default last;