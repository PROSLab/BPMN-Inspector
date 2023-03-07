"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isString = _interopRequireDefault(require("./isString"));

var _isObject = _interopRequireDefault(require("./isObject"));

var _isArray = _interopRequireDefault(require("./isArray"));

var _get = _interopRequireDefault(require("./get"));

var set = function set() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var value = arguments.length > 2 ? arguments[2] : undefined;
  obj = Object.assign({}, obj);
  keys = (0, _isString.default)(keys) ? keys.split('.') : keys;
  keys.reduce(function (res, key, idx) {
    var next = idx === keys.length - 1 ? value : (0, _get.default)(res, key, {});

    if ((0, _isObject.default)(next)) {
      next = Object.assign({}, next);
    }

    if ((0, _isArray.default)(next)) {
      next = next.slice();
    }

    res[key] = next;
    return res[key];
  }, obj);
  return obj;
};

var _default = set;
exports.default = _default;