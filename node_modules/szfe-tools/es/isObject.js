import _typeof from "@babel/runtime/helpers/esm/typeof";
import isArray from './isArray';
import isNull from './isNull';

var isObject = function isObject(value) {
  return _typeof(value) === 'object' && !(isArray(value) || isNull(value));
};

export default isObject;