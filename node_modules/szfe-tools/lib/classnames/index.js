"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = classnames;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _getClassNameArray = _interopRequireDefault(require("./getClassNameArray"));

function classnames() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _toConsumableArray2.default)(new Set((0, _getClassNameArray.default)(args))).join(' ').trim();
}

classnames.bind = function () {
  var mapper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return (0, _toConsumableArray2.default)(new Set((0, _getClassNameArray.default)(args).map(function (className) {
      return mapper[className] || className;
    }))).join(' ').trim();
  };
};