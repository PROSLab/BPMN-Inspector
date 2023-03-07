"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _isArray = _interopRequireDefault(require("./isArray"));

var _isNull = _interopRequireDefault(require("./isNull"));

var isObject = function isObject(value) {
  return (0, _typeof2.default)(value) === 'object' && !((0, _isArray.default)(value) || (0, _isNull.default)(value));
};

var _default = isObject;
exports.default = _default;