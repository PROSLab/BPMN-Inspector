"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isArray = _interopRequireDefault(require("../isArray"));

var _isUndefined = _interopRequireDefault(require("../isUndefined"));

var _globalThis = _interopRequireDefault(require("../globalThis"));

var _curry = _interopRequireDefault(require("../curry"));

var getExt = (0, _curry.default)(function (src, key) {
  var ext = _globalThis.default[key];
  !(0, _isUndefined.default)(key) && (0, _isUndefined.default)(ext) && console.warn("No external named '".concat(key, "' in global after loaded ").concat(src));
  return ext;
});

var getExternals = function getExternals(src, externals) {
  return (0, _isArray.default)(externals) ? externals.map(getExt(src)) : getExt(src, externals);
};

var _default = getExternals;
exports.default = _default;