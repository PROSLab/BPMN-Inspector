import get from './get';
import root from './globalThis';
var reg = /(Win32|Win64|MacIntel|Linux x86_64)/i;

var isDesktop = function isDesktop() {
  return reg.test(get(root, 'navigator.platform'));
};

export default isDesktop;