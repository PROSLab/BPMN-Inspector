"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pickBy = _interopRequireDefault(require("./pickBy"));

/**
 * [过滤对象属性] 挑选处一个对象中的指定属性
 * @param {Object} obj 数据源对象
 * @param {Array} keys
 */
var pick = function pick(obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object.keys(obj);
  return (0, _pickBy.default)(obj, function (value, key) {
    return keys.includes(key);
  });
};

var _default = pick;
exports.default = _default;