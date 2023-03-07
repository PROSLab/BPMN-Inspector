/**
 * [防抖]
 * @param {Function} func 执行函数
 * @param {Number} wait 多少毫秒后运行一次
 */
var debounce = function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  var timeout;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(_this, args);
    }, wait);
    return timeout;
  };
};

export default debounce;