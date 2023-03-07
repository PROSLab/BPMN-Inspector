import isExist from './isExist';
import isFunction from './isFunction';

var isPromiseLike = function isPromiseLike(value) {
  return isExist(value) && isFunction(value.then);
};

export default isPromiseLike;