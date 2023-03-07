"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _run = _interopRequireDefault(require("../../run"));

var _Thread = _interopRequireDefault(require("./Thread"));

/**
 * 帧任务进程
 * 作用：为任务分配适宜线程，并控制线程任务总数，以保证执行性能
 */
var Process =
/** @class */
function () {
  var Process = function Process() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Process);
    this.threadList = [];

    this.getAvailableThread = function () {
      var thread = _this.threadList.find(function (thread) {
        return thread.isAvailable();
      });

      if (!thread) {
        thread = new _Thread.default({
          maxTaskCount: _this.maxTaskCount
        });

        _this.threadList.push(thread);
      }

      return thread;
    };

    this.start = function (frame) {
      return _this.getAvailableThread().run(frame);
    };

    this.once = function (frame) {
      var stop = _this.start(function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _run.default.apply(void 0, [frame, undefined].concat(args));

        stop();
      });
    };

    var maxTaskCount = config.maxTaskCount;
    this.maxTaskCount = maxTaskCount;
  };

  Process.defaultProcess = new Process();
  return Process;
}();

var _default = Process;
exports.default = _default;