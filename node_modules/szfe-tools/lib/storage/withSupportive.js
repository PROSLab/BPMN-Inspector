"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withSupportive;

var _globalThis = _interopRequireDefault(require("../globalThis"));

var _isExist = _interopRequireDefault(require("../isExist"));

var isStorageSupported = true;
var TEST_KET = '__testSupportive__';
var storage = _globalThis.default.localStorage;

if (!(0, _isExist.default)(storage)) {
  isStorageSupported = false;
}

try {
  storage.setItem(TEST_KET, '__testSupportive__');
  storage.removeItem(TEST_KET);
} catch (err) {
  isStorageSupported = false;
}

function withSupportive(func) {
  if (!isStorageSupported) {
    return function () {
      return console.warn('Storage unsupported');
    };
  }

  return func;
}