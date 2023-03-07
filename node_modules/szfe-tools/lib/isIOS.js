"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get = _interopRequireDefault(require("./get"));

var _globalThis = _interopRequireDefault(require("./globalThis"));

var reg = /(iPhone|iPad|iPod|iOS)/i;

var isIOS = function isIOS() {
  return reg.test((0, _get.default)(_globalThis.default, 'navigator.userAgent'));
};

var _default = isIOS;
exports.default = _default;