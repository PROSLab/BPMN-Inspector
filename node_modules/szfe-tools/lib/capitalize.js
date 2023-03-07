"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = capitalize;

var _isString = _interopRequireDefault(require("./isString"));

function capitalize(word) {
  if (!(0, _isString.default)(word)) {
    return '';
  }

  if (/\s/.test(word)) {
    return word.split(' ').map(capitalize).join(' ');
  }

  return word.split('').map(function (letter, idx) {
    return idx === 0 ? letter.toUpperCase() : letter;
  }).join('');
}