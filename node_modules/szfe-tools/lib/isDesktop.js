"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get = _interopRequireDefault(require("./get"));

var _globalThis = _interopRequireDefault(require("./globalThis"));

var reg = /(Win32|Win64|MacIntel|Linux x86_64)/i;

var isDesktop = function isDesktop() {
  return reg.test((0, _get.default)(_globalThis.default, 'navigator.platform'));
};

var _default = isDesktop;
exports.default = _default;