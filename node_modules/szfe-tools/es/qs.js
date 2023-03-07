import * as url from './url';
export var parse = function parse(str) {
  return url.allParam(str);
};
export var stringify = function stringify() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return url.generateParamStr(params).replace(/^.?/, '');
};
export default {
  parse: parse,
  stringify: stringify
};