import get from './get';
import root from './globalThis';
import isIOS from './isIOS';
import isExist from './isExist';

var isWKWebview = function isWKWebview() {
  return isIOS() && isExist(get(root, 'webkit'));
};

export default isWKWebview;