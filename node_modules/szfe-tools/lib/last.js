"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isArray = _interopRequireDefault(require("./isArray"));

var _isObject = _interopRequireDefault(require("./isObject"));

/**
 * [返回数组或对象的末尾值]
 * @param {Array / Object} value 源集合
 */
var last = function last(value) {
  if ((0, _isArray.default)(value)) {
    return value[value.length - 1];
  }

  if ((0, _isObject.default)(value)) {
    var keys = Object.keys(value);
    return value[last(keys)];
  }

  return undefined;
};

var _default = last;
exports.default = _default;