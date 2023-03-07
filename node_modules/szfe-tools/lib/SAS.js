"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lock = _interopRequireDefault(require("./lock"));

/**
 * [单咨询服务] Single Advisory Service 同一时刻对同一异步请求进行统一等待，不重复发起
 * @param {Function} query 异步查询函数，需要返回 Promise
 */
var SAS = function SAS(query) {
  var wrappedFunc = (0, _lock.default)(function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(resolve, reject) {
        var result;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return query.apply(_this, args);

              case 3:
                result = _context.sent;
                resolve(result);
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                reject(_context.t0);

              case 10:
                _context.prev = 10;
                wrappedFunc.unlock();
                return _context.finish(10);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7, 10, 13]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  });
  return wrappedFunc;
};

var _default = SAS;
exports.default = _default;