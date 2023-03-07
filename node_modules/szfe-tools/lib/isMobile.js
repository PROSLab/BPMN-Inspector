"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isDesktop = _interopRequireDefault(require("./isDesktop"));

var _isAndroid = _interopRequireDefault(require("./isAndroid"));

var _isIOS = _interopRequireDefault(require("./isIOS"));

var isMobile = function isMobile() {
  return !(0, _isDesktop.default)() && ((0, _isAndroid.default)() || (0, _isIOS.default)());
};

var _default = isMobile;
exports.default = _default;