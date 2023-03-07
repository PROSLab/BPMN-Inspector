"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isUndefined = _interopRequireDefault(require("./isUndefined"));

var _run = _interopRequireDefault(require("./run"));

var value = function value() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return values.reduce(function (value, nextValue) {
    return (0, _isUndefined.default)(value) ? (0, _run.default)(nextValue) : (0, _run.default)(value);
  }, undefined);
};

var _default = value;
exports.default = _default;