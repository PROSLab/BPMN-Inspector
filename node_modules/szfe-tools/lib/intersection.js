"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pipe = _interopRequireDefault(require("./pipe"));

var _flatten = _interopRequireDefault(require("./flatten"));

/**
 * [交集]
 * 示例：intersection([1, 2], [2, 3]) => [2]
 */
var intersection = function intersection() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _pipe.default)(_flatten.default, function (_) {
    return new Set(_);
  }, Array.from)(args).filter(function (item) {
    return args.every(function (arr) {
      return arr.includes(item);
    });
  });
};

var _default = intersection;
exports.default = _default;