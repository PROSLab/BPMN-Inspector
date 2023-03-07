"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isExist = _interopRequireDefault(require("./isExist"));

var _isFunction = _interopRequireDefault(require("./isFunction"));

var isPromiseLike = function isPromiseLike(value) {
  return (0, _isExist.default)(value) && (0, _isFunction.default)(value.then);
};

var _default = isPromiseLike;
exports.default = _default;