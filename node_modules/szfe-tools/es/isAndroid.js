import get from './get';
import root from './globalThis';
var reg = /(Android)/i;

var isAndroid = function isAndroid() {
  return reg.test(get(root, 'navigator.userAgent'));
};

export default isAndroid;