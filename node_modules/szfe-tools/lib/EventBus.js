"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _isFunction = _interopRequireDefault(require("./isFunction"));

var _isUndefined = _interopRequireDefault(require("./isUndefined"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var EventBus = function EventBus() {
  var _this = this;

  (0, _classCallCheck2.default)(this, EventBus);
  this.listeners = {};

  this.getEventMap = function (event) {
    if (!_this.listeners[event]) {
      _this.listeners[event] = new Map();
    }

    return _this.listeners[event];
  };

  this.on = function (event, listener) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$once = _ref.once,
        once = _ref$once === void 0 ? false : _ref$once;

    if (!(0, _isFunction.default)(listener)) {
      console.error('[EventBus Error] listener is not a function');
      return _this;
    }

    _this.getEventMap(event).set(listener, once ? function () {
      listener.apply(void 0, arguments);

      _this.off(event, listener);
    } : listener);

    return _this;
  };

  this.once = function (event, listener) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return _this.on(event, listener, _objectSpread(_objectSpread({}, config), {}, {
      once: true
    }));
  };

  this.off = function (event, listener) {
    var eventMap = _this.getEventMap(event);

    if ((0, _isUndefined.default)(listener)) {
      eventMap.clear();
    } else {
      eventMap.delete(listener);
    }

    return _this;
  };

  this.emit = function (event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return _this.getEventMap(event).forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  };
};

exports.default = EventBus;