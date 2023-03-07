import random from './random';
import get from './get';
/**
 * [抽样] 随机获取数组中的一个值
 * @param {Array} array 抽样数组
 */

var sample = function sample(array) {
  return get(array, random(0, get(array, 'length', 0)));
};

export default sample;