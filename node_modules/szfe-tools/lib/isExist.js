"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isUndefined = _interopRequireDefault(require("./isUndefined"));

var _isNull = _interopRequireDefault(require("./isNull"));

var isExist = function isExist(value) {
  return !((0, _isUndefined.default)(value) || (0, _isNull.default)(value));
};

var _default = isExist;
exports.default = _default;