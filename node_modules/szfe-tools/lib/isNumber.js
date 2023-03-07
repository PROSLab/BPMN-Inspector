"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isNaN = _interopRequireDefault(require("./isNaN"));

var isNumber = function isNumber(value) {
  return typeof value === 'number' && !(0, _isNaN.default)(value);
};

var _default = isNumber;
exports.default = _default;