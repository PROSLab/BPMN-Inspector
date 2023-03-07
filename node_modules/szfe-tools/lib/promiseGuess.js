"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isPromiseLike = _interopRequireDefault(require("./isPromiseLike"));

/**
 * [用来智能处理Promise类型返回值]
 * 当值生成过程为 promise 时，将得到 promise 类型返回值，按约定 resolve 最终值
 * 当过程不为 promise 时将直接得到值
 * @param {Function} executor 执行过程获取
 * @param {Function} valuer 值处理过程
 */
var promiseGuess = function promiseGuess(executor, valuer) {
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var value = executor.apply(this, args);
    return (0, _isPromiseLike.default)(value) ? new Promise(function (resolve) {
      return value.then(function (value) {
        return resolve(valuer.call.apply(valuer, [_this, null, value].concat(args)));
      }).catch(function (err) {
        return resolve(valuer.call.apply(valuer, [_this, err, undefined].concat(args)));
      });
    }) : valuer.call.apply(valuer, [this, null, value].concat(args));
  };
};

var _default = promiseGuess;
exports.default = _default;