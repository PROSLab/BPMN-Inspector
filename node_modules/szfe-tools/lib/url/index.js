"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.param = param;
exports.allParam = allParam;
exports.generateParamStr = generateParamStr;
exports.default = exports.allParamEscape = exports.paramEscape = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _isNull = _interopRequireDefault(require("../isNull"));

var _get = _interopRequireDefault(require("../get"));

var _run = _interopRequireDefault(require("../run"));

var _globalThis = _interopRequireDefault(require("../globalThis"));

var _ = _interopRequireDefault(require("../__"));

var safeDecode = function safeDecode(value) {
  var decoders = [_globalThis.default.decodeURIComponent, _globalThis.default.decodeURI, _globalThis.default.unescape];

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

var paramEscape = (0, _.default)(param)(_.default, _.default, _globalThis.default.unescape);
exports.paramEscape = paramEscape;

function param(name) {
  var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _globalThis.default.location.search;
  var decode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : safeDecode;
  var res = (0, _get.default)((0, _run.default)(url, 'split', '?'), '1', '').match(new RegExp("(^|&)".concat(name, "=([^&]*)(&|$)")));
  return (0, _isNull.default)(res) ? undefined : decode(res[2]);
}

var allParamEscape = (0, _.default)(allParam)(_.default, _globalThis.default.unescape);
exports.allParamEscape = allParamEscape;

function allParam() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _globalThis.default.location.search;
  var decode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : safeDecode;
  var search = (0, _get.default)(url.split('?'), [1], '');

  if (search.length === 0) {
    return {};
  }

  return search.split('&').map(function (param) {
    return param.split('=');
  }).reduce(function (res, _ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return Object.assign(res, (0, _defineProperty2.default)({}, key, decode(value)));
  }, {});
}

function generateParamStr(paramObj) {
  var encode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _globalThis.default.encodeURIComponent;
  return "?".concat(Object.entries(paramObj).map(function (_ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    return [key, encode(value)].join('=');
  }).join('&'));
}

var _default = {
  paramEscape: paramEscape,
  param: param,
  allParamEscape: allParamEscape,
  allParam: allParam,
  generateParamStr: generateParamStr
};
exports.default = _default;