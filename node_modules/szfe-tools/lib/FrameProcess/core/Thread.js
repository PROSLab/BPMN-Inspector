"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _run = _interopRequireDefault(require("../../run"));

var _globalThis = _interopRequireDefault(require("../../globalThis"));

var requestAnimationFrame = _globalThis.default.requestAnimationFrame;

var Thread = function Thread() {
  var _this = this;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$maxTaskCount = _ref.maxTaskCount,
      maxTaskCount = _ref$maxTaskCount === void 0 ? 20 : _ref$maxTaskCount;

  (0, _classCallCheck2.default)(this, Thread);
  this.taskList = new Set();

  this.isAvailable = function () {
    return _this.taskList.size >= _this.maxTaskCount;
  }; //进程是否正在工作：进程工作过程中若插入新的任务，不会影响目前的工作流程


  this.isRunning = false; //帧函数

  this.frame = function () {
    var frameTime = Date.now(); //执行任务帧

    _this.taskList.forEach(function (_ref2) {
      var frame = _ref2.frame,
          startTime = _ref2.startTime;
      return (0, _run.default)(frame, undefined, {
        runningTime: frameTime - startTime,
        startTime: startTime,
        frameTime: frameTime
      });
    }); //若有未结束任务，则继续下一帧


    if (_this.taskList.size > 0) {
      requestAnimationFrame(_this.frame);
    } else {
      _this.isRunning = false;
    }
  };

  this.run = function (frame) {
    var task = {
      startTime: Date.now(),
      frame: frame
    };

    _this.taskList.add(task);

    if (!_this.isRunning) {
      requestAnimationFrame(function () {
        _this.isRunning = true;

        _this.frame();
      });
    }

    return function () {
      return _this.taskList.delete(task);
    };
  };

  this.maxTaskCount = maxTaskCount;
};

exports.default = Thread;