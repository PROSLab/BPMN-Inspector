"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = get;

var _isString = _interopRequireDefault(require("./isString"));

var _isUndefined = _interopRequireDefault(require("./isUndefined"));

var _isNumber = _interopRequireDefault(require("./isNumber"));

function get(obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var defaultValue = arguments.length > 2 ? arguments[2] : undefined;

  try {
    if ((0, _isNumber.default)(keys)) {
      keys = String(keys);
    }

    var result = ((0, _isString.default)(keys) ? keys.split('.') : keys).reduce(function (res, key) {
      return res[key];
    }, obj);
    return (0, _isUndefined.default)(result) ? defaultValue : result;
  } catch (e) {
    return defaultValue;
  }
}