import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import lock from './lock';
/**
 * [单咨询服务] Single Advisory Service 同一时刻对同一异步请求进行统一等待，不重复发起
 * @param {Function} query 异步查询函数，需要返回 Promise
 */

var SAS = function SAS(query) {
  var wrappedFunc = lock(function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(resolve, reject) {
        var result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
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

export default SAS;