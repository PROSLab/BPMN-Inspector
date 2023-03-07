import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import run from '../../run';
import Thread from './Thread';
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

    _classCallCheck(this, Process);

    this.threadList = [];

    this.getAvailableThread = function () {
      var thread = _this.threadList.find(function (thread) {
        return thread.isAvailable();
      });

      if (!thread) {
        thread = new Thread({
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

        run.apply(void 0, [frame, undefined].concat(args));
        stop();
      });
    };

    var maxTaskCount = config.maxTaskCount;
    this.maxTaskCount = maxTaskCount;
  };

  Process.defaultProcess = new Process();
  return Process;
}();

export default Process;