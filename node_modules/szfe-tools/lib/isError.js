"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _globalThis = _interopRequireDefault(require("./globalThis"));

var _isUndefined = _interopRequireDefault(require("./isUndefined"));

var errorTypes = ['Error', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError'].map(function (key) {
  return _globalThis.default[key];
}).filter(function (type) {
  return !(0, _isUndefined.default)(type);
});

var isError = function isError(value) {
  return errorTypes.some(function (errorType) {
    return value instanceof errorType;
  });
};

var _default = isError;
exports.default = _default;