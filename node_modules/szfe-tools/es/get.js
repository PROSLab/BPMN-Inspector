import isString from './isString';
import isUndefined from './isUndefined';
import isNumber from './isNumber';
export default function get(obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var defaultValue = arguments.length > 2 ? arguments[2] : undefined;

  try {
    if (isNumber(keys)) {
      keys = String(keys);
    }

    var result = (isString(keys) ? keys.split('.') : keys).reduce(function (res, key) {
      return res[key];
    }, obj);
    return isUndefined(result) ? defaultValue : result;
  } catch (e) {
    return defaultValue;
  }
}