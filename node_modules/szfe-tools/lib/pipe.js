"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _run = _interopRequireDefault(require("./run"));

var pipe = function pipe() {
  for (var _len = arguments.length, handlers = new Array(_len), _key = 0; _key < _len; _key++) {
    handlers[_key] = arguments[_key];
  }

  return function (arg) {
    return handlers.reduce(function (res, handler) {
      return (0, _run.default)(handler, undefined, res);
    }, arg);
  };
};

var _default = pipe;
exports.default = _default;