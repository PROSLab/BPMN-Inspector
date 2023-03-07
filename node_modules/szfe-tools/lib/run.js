"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isString = _interopRequireDefault(require("./isString"));

var _isFunction = _interopRequireDefault(require("./isFunction"));

var _get = _interopRequireDefault(require("./get"));

var run = function run(obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  keys = (0, _isString.default)(keys) ? keys.split('.') : keys;
  var func = (0, _get.default)(obj, keys);
  var context = (0, _get.default)(obj, keys.slice(0, -1));

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return (0, _isFunction.default)(func) ? func.call.apply(func, [context].concat(args)) : func;
};

var _default = run;
exports.default = _default;