"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var preloadImage = function preloadImage(srcList) {
  return srcList.forEach(function (src) {
    var img = new Image();
    img.src = src;
  });
};

var _default = preloadImage;
exports.default = _default;