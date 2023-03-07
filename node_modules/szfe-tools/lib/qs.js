"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.stringify = exports.parse = void 0;

var url = _interopRequireWildcard(require("./url"));

var parse = function parse(str) {
  return url.allParam(str);
};

exports.parse = parse;

var stringify = function stringify() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return url.generateParamStr(params).replace(/^.?/, '');
};

exports.stringify = stringify;
var _default = {
  parse: parse,
  stringify: stringify
};
exports.default = _default;