import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import isObject from '../isObject';
import isArray from '../isArray';
import isString from '../isString';
import flatten from '../flatten';

var mapObjectClassName = function mapObjectClassName(obj) {
  return Object.entries(obj).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        value = _ref2[1];

    return !!value;
  }).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
        key = _ref4[0];

    return key;
  });
};

var parseClassName = function parseClassName(className) {
  return /\s/.test(className) ? className.trim().split(' ') : className;
};

var getClassNameArray = function getClassNameArray() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return flatten(args.filter(function (arg) {
    return !!arg;
  }).map(function (arg) {
    if (isObject(arg)) {
      return mapObjectClassName(arg);
    }

    if (isArray(arg)) {
      return getClassNameArray.apply(void 0, _toConsumableArray(arg));
    }

    if (isString(arg)) {
      return parseClassName(arg);
    }

    return String(arg);
  }));
};

export default getClassNameArray;