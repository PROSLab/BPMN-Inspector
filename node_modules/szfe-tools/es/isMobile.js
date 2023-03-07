import isDesktop from './isDesktop';
import isAndroid from './isAndroid';
import isIOS from './isIOS';

var isMobile = function isMobile() {
  return !isDesktop() && (isAndroid() || isIOS());
};

export default isMobile;