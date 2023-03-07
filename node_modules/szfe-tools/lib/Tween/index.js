"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _FrameProcess = require("../FrameProcess");

var _EventBus = _interopRequireDefault(require("../EventBus"));

var _clamp = _interopRequireDefault(require("../clamp"));

var _pickBy = _interopRequireDefault(require("../pickBy"));

var _run = _interopRequireDefault(require("../run"));

var _isFunction = _interopRequireDefault(require("../isFunction"));

var _isExist = _interopRequireDefault(require("../isExist"));

var _easing = _interopRequireDefault(require("./easing"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DEFAULT_CONFIG = {
  from: 0,
  to: 1,
  duration: 1000,
  ease: 'linear',
  loop: false
};

var Tween =
/** @class */
function () {
  var Tween = function Tween() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CONFIG;
    (0, _classCallCheck2.default)(this, Tween);
    this.bus = new _EventBus.default();
    this.state = {
      reversed: false,
      progress: 0,
      stoped: true,
      config: DEFAULT_CONFIG
    };

    this.on = function (event, listeners) {
      var _this$bus;

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      (_this$bus = _this.bus).on.apply(_this$bus, [event, listeners].concat(args));

      return _this;
    };

    this.off = function (event, listeners) {
      _this.bus.off(event, listeners);

      return _this;
    };

    this.config = function () {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CONFIG;
      _this.state.config = _objectSpread(_objectSpread(_objectSpread({}, DEFAULT_CONFIG), _this.state.config), (0, _pickBy.default)(config, _isExist.default));
      return _this;
    };

    this.start = function () {
      if (_this.isEnded() || !_this.state.stoped) {
        return _this;
      }

      _this.state.stoped = false;

      _this.bus.emit('start');

      var prevFrameTime = Date.now();
      _this.stopRunningFrame = _FrameProcess.defaultProcess.start(function (_ref) {
        var frameTime = _ref.frameTime;
        var frameProgress = (frameTime - prevFrameTime) / (0, _clamp.default)(_this.state.config.duration, 16);
        var direction = _this.state.reversed ? -1 : 1;

        _this.progress(_this.state.progress + frameProgress * direction);

        prevFrameTime = frameTime;
      });
      return _this;
    };

    this.restart = function () {
      return _this.reset().start();
    };

    this.reset = function () {
      var reversed = _this.state.reversed;
      return _this.stop().progress(reversed ? 1 : 0);
    };

    this.stop = function () {
      if (_this.state.stoped) {
        return _this;
      }

      _this.state.stoped = true;
      (0, _run.default)(_this.stopRunningFrame);

      _this.bus.emit('stop');

      return _this;
    };

    this.reverse = function () {
      _this.state.reversed = !_this.state.reversed;

      _this.bus.emit('reverse');

      return _this;
    };

    this.progress = function (progress) {
      var preProgress = _this.state.progress;
      _this.state.progress = (0, _clamp.default)(progress, 0, 1);

      _this.bus.emit('update', _this.value(progress), _this.value(preProgress));

      if (_this.isEnded()) {
        if (_this.state.config.loop) {
          _this.state.reversed = !_this.state.reversed;
        } else {
          _this.stop();

          _this.bus.emit('end');
        }
      }

      return _this;
    };

    this.value = function () {
      var progress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.progress;
      progress = (0, _clamp.default)(progress, 0, 1);
      var config = _this.state.config;
      var ease = config.ease,
          to = config.to,
          from = config.from;
      var easeFn = (0, _isFunction.default)(ease) ? ease : _easing.default[ease];
      return (to - from) * easeFn(progress) + from;
    };

    this.isEnded = function () {
      var progress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.progress;
      var reversed = _this.state.reversed;
      return reversed ? progress <= 0 : progress >= 1;
    };

    this.config(config);
  };

  Tween.easing = _easing.default;
  Tween.DEFAULT_CONFIG = DEFAULT_CONFIG;
  return Tween;
}();

var _default = Tween;
exports.default = _default;