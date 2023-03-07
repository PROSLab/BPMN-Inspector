"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _isObject = _interopRequireDefault(require("../isObject"));

var _isArray = _interopRequireDefault(require("../isArray"));

var _isString = _interopRequireDefault(require("../isString"));

var _flatten = _interopRequireDefault(require("../flatten"));

var mapObjectClassName = function mapObjectClassName(obj) {
  return Object.entries(obj).filter(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        value = _ref2[1];

    return !!value;
  }).map(function (_ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 1),
        key = _ref4[0];

    return key;
  });
};

var parseClassName = function parseClassName(className) {
  return /\s/.test(className) ? className.trim().split(' ') : className;
};

var getClassNameArray = function getClassNameArray() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _flatten.default)(args.filter(function (arg) {
    return !!arg;
  }).map(function (arg) {
    if ((0, _isObject.default)(arg)) {
      return mapObjectClassName(arg);
    }

    if ((0, _isArray.default)(arg)) {
      return getClassNameArray.apply(void 0, (0, _toConsumableArray2.default)(arg));
    }

    if ((0, _isString.default)(arg)) {
      return parseClassName(arg);
    }

    return String(arg);
  }));
};

var _default = getClassNameArray;
exports.default = _default;