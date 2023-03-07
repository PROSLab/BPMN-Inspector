"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var delay = function delay(time) {
  return new Promise(function (resolve) {
    if (time === Infinity) {
      // Never resolve
      return;
    }

    setTimeout(resolve, time);
  });
};

var _default = delay;
exports.default = _default;