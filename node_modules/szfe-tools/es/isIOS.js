import get from './get';
import root from './globalThis';
var reg = /(iPhone|iPad|iPod|iOS)/i;

var isIOS = function isIOS() {
  return reg.test(get(root, 'navigator.userAgent'));
};

export default isIOS;