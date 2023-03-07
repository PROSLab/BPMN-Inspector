"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isArray = _interopRequireDefault(require("./isArray"));

var _isObject = _interopRequireDefault(require("./isObject"));

/**
 * [返回数组或对象的首个值]
 * @param {Array / Object} value 源集合
 */
var first = function first(value) {
  if ((0, _isArray.default)(value)) {
    return value[0];
  }

  if ((0, _isObject.default)(value)) {
    var keys = Object.keys(value);
    return value[first(keys)];
  }

  return undefined;
};

var _default = first;
exports.default = _default;