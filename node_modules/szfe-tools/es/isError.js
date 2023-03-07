import root from './globalThis';
import isUndefined from './isUndefined';
var errorTypes = ['Error', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError'].map(function (key) {
  return root[key];
}).filter(function (type) {
  return !isUndefined(type);
});

var isError = function isError(value) {
  return errorTypes.some(function (errorType) {
    return value instanceof errorType;
  });
};

export default isError;