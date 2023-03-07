"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var nextTick = function nextTick(func) {
  return Promise.resolve().then(func);
};

var _default = nextTick;
exports.default = _default;