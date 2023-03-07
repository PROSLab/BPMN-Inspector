import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import isArray from './isArray';

var flatten = function flatten(array) {
  return array.reduce(function (res, item) {
    return [].concat(_toConsumableArray(res), _toConsumableArray(isArray(item) ? flatten(item) : [item]));
  }, []);
};

export default flatten;