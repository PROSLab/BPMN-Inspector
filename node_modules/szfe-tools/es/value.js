import isUndefined from './isUndefined';
import run from './run';

var value = function value() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return values.reduce(function (value, nextValue) {
    return isUndefined(value) ? run(nextValue) : run(value);
  }, undefined);
};

export default value;