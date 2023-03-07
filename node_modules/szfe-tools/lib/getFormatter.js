"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isUndefined = _interopRequireDefault(require("./isUndefined"));

var _isNumber = _interopRequireDefault(require("./isNumber"));

var getFormatter = function getFormatter() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$separator = _ref.separator,
      separator = _ref$separator === void 0 ? ' ' : _ref$separator,
      _ref$length = _ref.length,
      length = _ref$length === void 0 ? 3 : _ref$length,
      _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === void 0 ? false : _ref$reverse,
      _ref$isNumber = _ref.isNumber,
      isNumberFormat = _ref$isNumber === void 0 ? false : _ref$isNumber;

  return function (text) {
    if (isNumberFormat) {
      var hasDot = text.toString().indexOf('.') !== -1;

      if (hasDot) {
        return text && text.toString().replace(new RegExp("(\\d)(?=(\\d{".concat(length, "})+\\.)"), 'g'), function ($0, $1) {
          return $1 + separator;
        });
      } else {
        return text && text.toString().replace(new RegExp("\\d{1,".concat(length, "}(?=(\\d{").concat(length, "})+$)"), 'g'), "$&".concat(separator));
      }
    }

    text = (0, _isNumber.default)(text) ? Math.floor(text) : text;

    if ((0, _isUndefined.default)(text)) {
      return text;
    }

    var res = String(text).split('');

    if (!reverse) {
      res = res.reverse();
    }

    res = res.reduce(function (result, letter, index) {
      result.unshift(letter, index > 0 && index % length === 0 ? separator : undefined);
      return result;
    }, []);

    if (reverse) {
      res = res.reverse();
    }

    res = res.join('');
    return res;
  };
};

var _default = getFormatter;
exports.default = _default;