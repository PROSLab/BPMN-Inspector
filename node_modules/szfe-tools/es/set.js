import isString from './isString';
import isObject from './isObject';
import isArray from './isArray';
import get from './get';

var set = function set() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var value = arguments.length > 2 ? arguments[2] : undefined;
  obj = Object.assign({}, obj);
  keys = isString(keys) ? keys.split('.') : keys;
  keys.reduce(function (res, key, idx) {
    var next = idx === keys.length - 1 ? value : get(res, key, {});

    if (isObject(next)) {
      next = Object.assign({}, next);
    }

    if (isArray(next)) {
      next = next.slice();
    }

    res[key] = next;
    return res[key];
  }, obj);
  return obj;
};

export default set;