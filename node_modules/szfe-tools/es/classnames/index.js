import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import getClassNameArray from './getClassNameArray';
export default function classnames() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _toConsumableArray(new Set(getClassNameArray(args))).join(' ').trim();
}

classnames.bind = function () {
  var mapper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _toConsumableArray(new Set(getClassNameArray(args).map(function (className) {
      return mapper[className] || className;
    }))).join(' ').trim();
  };
};