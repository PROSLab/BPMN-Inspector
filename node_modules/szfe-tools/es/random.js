/**
 * [随机函数] 获取 (min, max) 之间的一个随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
var random = function random(min, max) {
  var int = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var value = Math.random() * (max - min) + min;
  return int ? Math.floor(value) : value;
};

export default random;