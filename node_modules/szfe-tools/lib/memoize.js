"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * [缓存函数结果]
 * @param {Function} func 被处理的函数
 */
var memoize = function memoize(func) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$disable = _ref.disable,
      disable = _ref$disable === void 0 ? function () {
    return false;
  } : _ref$disable;

  var cache = new Map();

  var memoizedFunc = function memoizedFunc(key) {
    if (cache.has(key)) {
      return cache.get(key);
    }

    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    var result = func.call.apply(func, [this, key].concat(rest));

    if (!disable.call(this, {
      cache: cache,
      key: key,
      result: result,
      drop: function drop() {
        return cache.delete(key);
      }
    })) {
      cache.set(key, result);
    }

    return result;
  };

  memoizedFunc.cache = cache;
  return memoizedFunc;
};

var _default = memoize;
exports.default = _default;