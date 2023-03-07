import memoize from './memoize';
import run from './run';
var memoizedFunction = memoize(function (func) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return func.call.apply(func, [this].concat(args));
});
/**
 * [自锁函数] 函数运行后会立即上锁，显式调用 fn.unlock 来解锁
 * 已上锁后，后续的函数调用将返回上锁时的调用结果
 * @param {Function} func 需要自锁的函数
 * @param {Function} conf.always 总是会调用
 * @param {Function} conf.locking 自锁时调用
 */

var lock = function lock(func) {
  var conf = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var always = conf.always,
      locking = conf.locking;

  var unlock = function unlock() {
    return memoizedFunction.cache.delete(func);
  };

  var isLocked = function isLocked() {
    return memoizedFunction.cache.has(func);
  };

  var lockedFunc = function lockedFunc() {
    run(always);

    if (isLocked()) {
      run(locking);
    }

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return memoizedFunction.call.apply(memoizedFunction, [this, func].concat(args));
  };

  return Object.assign(lockedFunc, {
    unlock: unlock,
    isLocked: isLocked
  });
};

lock.memory = memoizedFunction;
export default lock;