import isString from './isString';
import isFunction from './isFunction';
import get from './get';

var run = function run(obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  keys = isString(keys) ? keys.split('.') : keys;
  var func = get(obj, keys);
  var context = get(obj, keys.slice(0, -1));

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return isFunction(func) ? func.call.apply(func, [context].concat(args)) : func;
};

export default run;