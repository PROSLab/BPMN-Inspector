import isUndefined from './isUndefined';
import isNull from './isNull';

var isExist = function isExist(value) {
  return !(isUndefined(value) || isNull(value));
};

export default isExist;