"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

/* ts-ignore */
var getImplementation = function getImplementation() {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  } // @ts-ignore


  if (typeof global !== 'undefined') {
    // @ts-ignore
    return global;
  }

  return Function('return this')();
};

var implementation = getImplementation();

var getGlobal = function getGlobal() {
  if ( // @ts-ignore
  (typeof global === "undefined" ? "undefined" : (0, _typeof2.default)(global)) !== 'object' || // @ts-ignore
  !global || // @ts-ignore
  global.Math !== Math || // @ts-ignore
  global.Array !== Array) {
    return implementation;
  } // @ts-ignore


  return global; // return implementation
};

var globalThis = getGlobal();
var _default = globalThis;
exports.default = _default;