import debounce from './debounce';
/**
 * [节流]
 * @param {Function} func 执行函数
 * @param {Number} wait 多少毫秒内运行一次
 */

var throttle = function throttle(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  var locking = false;

  var release = function release() {
    locking = false;
  };

  var debounced = debounce(func, wait);
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    debounced.apply(this, args); // 确保最后一次会执行

    if (locking) {
      return;
    }

    locking = true;
    func.apply(this, args);
    setTimeout(release, wait);
  };
};

export default throttle;