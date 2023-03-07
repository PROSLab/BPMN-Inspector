"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _random = _interopRequireDefault(require("./random"));

var _get = _interopRequireDefault(require("./get"));

/**
 * [抽样] 随机获取数组中的一个值
 * @param {Array} array 抽样数组
 */
var sample = function sample(array) {
  return (0, _get.default)(array, (0, _random.default)(0, (0, _get.default)(array, 'length', 0)));
};

var _default = sample;
exports.default = _default;