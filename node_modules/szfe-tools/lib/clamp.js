"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clamp;

/**
 * [钳子] 用来将数字限制在给定范围内
 * @param {Number} value 被限制值
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
function clamp(value, min) {
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.MAX_VALUE;

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}