import isNaN from './isNaN';

var isNumber = function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
};

export default isNumber;