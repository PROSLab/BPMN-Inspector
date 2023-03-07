"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _isArray = _interopRequireDefault(require("./isArray"));

var flatten = function flatten(array) {
  return array.reduce(function (res, item) {
    return [].concat((0, _toConsumableArray2.default)(res), (0, _toConsumableArray2.default)((0, _isArray.default)(item) ? flatten(item) : [item]));
  }, []);
};

var _default = flatten;
exports.default = _default;