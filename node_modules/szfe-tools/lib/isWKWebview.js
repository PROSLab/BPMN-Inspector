"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get = _interopRequireDefault(require("./get"));

var _globalThis = _interopRequireDefault(require("./globalThis"));

var _isIOS = _interopRequireDefault(require("./isIOS"));

var _isExist = _interopRequireDefault(require("./isExist"));

var isWKWebview = function isWKWebview() {
  return (0, _isIOS.default)() && (0, _isExist.default)((0, _get.default)(_globalThis.default, 'webkit'));
};

var _default = isWKWebview;
exports.default = _default;