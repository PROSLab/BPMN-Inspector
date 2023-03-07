import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import isNull from '../isNull';
import get from '../get';
import run from '../run';
import root from '../globalThis';
import __ from '../__';

var safeDecode = function safeDecode(value) {
  var decoders = [root.decodeURIComponent, root.decodeURI, root.unescape];

  for (var _i = 0, _decoders = decoders; _i < _decoders.length; _i++) {
    var decode = _decoders[_i];

    try {
      return decode(value);
    } catch (error) {
      continue;
    }
  }

  return value;
};

export var paramEscape = __(param)(__, __, root.unescape);
export function param(name) {
  var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : root.location.search;
  var decode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : safeDecode;
  var res = get(run(url, 'split', '?'), '1', '').match(new RegExp("(^|&)".concat(name, "=([^&]*)(&|$)")));
  return isNull(res) ? undefined : decode(res[2]);
}
export var allParamEscape = __(allParam)(__, root.unescape);
export function allParam() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : root.location.search;
  var decode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : safeDecode;
  var search = get(url.split('?'), [1], '');

  if (search.length === 0) {
    return {};
  }

  return search.split('&').map(function (param) {
    return param.split('=');
  }).reduce(function (res, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return Object.assign(res, _defineProperty({}, key, decode(value)));
  }, {});
}
export function generateParamStr(paramObj) {
  var encode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : root.encodeURIComponent;
  return "?".concat(Object.entries(paramObj).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    return [key, encode(value)].join('=');
  }).join('&'));
}
export default {
  paramEscape: paramEscape,
  param: param,
  allParamEscape: allParamEscape,
  allParam: allParam,
  generateParamStr: generateParamStr
};