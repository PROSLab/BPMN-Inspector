"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _isFunction = _interopRequireDefault(require("./isFunction"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var OUTSIDE = 'OUTSIDE';
var INSIDE = 'INSIDE';
var DIRECTION_FORWARD = 1;
var DIRECTION_BACKWARD = -1;
var SCROLL_EVENT_NAME = 'scroll';

var getEventDistance = function getEventDistance(event) {
  return (0, _isFunction.default)(event.distance) ? event.distance() : event.distance;
};
/**
 * 默认使用 requestAnimationFrame 优化 scroll 监听
 */


var defaultGetScrollHandler = function defaultGetScrollHandler(onScroll) {
  var rAFLock = false;

  var scrollHandler = function scrollHandler(e) {
    if (rAFLock) return;
    requestAnimationFrame(function () {
      onScroll(e);
      rAFLock = false;
    });
    rAFLock = true;
  };

  return scrollHandler;
};

var ScrollListener = /*#__PURE__*/function () {
  function ScrollListener(config) {
    var _this = this;

    (0, _classCallCheck2.default)(this, ScrollListener);

    this.destroy = function () {
      return null;
    };

    this.dynamicEvents = [];
    this.staticEvents = [];

    this.walkEvent = function (event, scrollDistance) {
      var _event$onGoingIn = event.onGoingIn,
          onGoingIn = _event$onGoingIn === void 0 ? function () {
        return undefined;
      } : _event$onGoingIn,
          _event$onGoingOut = event.onGoingOut,
          onGoingOut = _event$onGoingOut === void 0 ? function () {
        return undefined;
      } : _event$onGoingOut,
          status = event.status;
      var distance = getEventDistance(event); // 仅当状态值变更时触发 onGoingIn、onGoingOut 函数

      switch (status) {
        case INSIDE:
          {
            if (scrollDistance > distance) {
              onGoingOut();
              event.status = OUTSIDE;
            }

            break;
          }

        default:
        case OUTSIDE:
          {
            if (scrollDistance <= distance) {
              onGoingIn();
              event.status = INSIDE;
            }

            break;
          }
      }

      return event.status !== status;
    };

    this.walkStaticEvent = function (_ref) {
      var direction = _ref.direction,
          scrollDistance = _ref.scrollDistance;
      var current = _this.currentStaticEvent;

      if (!current) {
        return;
      }

      var prev = current.prevEvent || current.getPrevEvent();
      var next = current.nextEvent || current.getNextEvent();
      var target = current;

      if (direction === DIRECTION_FORWARD) {
        if (current.status === OUTSIDE) {
          target = next;
        }
      } else {
        if (current.status === INSIDE) {
          target = prev;
        }
      }

      if (target) {
        var changed = _this.walkEvent(target, scrollDistance); // 若发生状态变迁


        if (changed) {
          _this.currentStaticEvent = (direction === DIRECTION_FORWARD ? next : prev) || current;

          _this.walkStaticEvent({
            direction: direction,
            scrollDistance: scrollDistance
          });
        }
      }
    };

    this.walkDynamicEvents = function (_ref2) {
      var direction = _ref2.direction,
          scrollDistance = _ref2.scrollDistance;

      _this.dynamicEvents.sort(function (prev, next) {
        return (getEventDistance(prev) - getEventDistance(next)) * direction;
      }).forEach(function (event) {
        _this.walkEvent(event, scrollDistance);
      });
    };

    this.config = config;
    this.init();
  }

  (0, _createClass2.default)(ScrollListener, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      var _this$config = this.config,
          element = _this$config.element,
          _this$config$scrollHa = _this$config.scrollHandler,
          getScrollHandler = _this$config$scrollHa === void 0 ? defaultGetScrollHandler : _this$config$scrollHa,
          configGetScrollDistance = _this$config.getScrollDistance,
          _this$config$directio = _this$config.direction,
          direction = _this$config$directio === void 0 ? 'vertical' : _this$config$directio; // 若无滚动载体，报错并退出

      if (typeof element === 'undefined') {
        console.error('Need Scroll Container!');
        return;
      }

      var getScrollDistance = (0, _isFunction.default)(configGetScrollDistance) ? configGetScrollDistance : {
        vertical: function vertical() {
          return element.scrollTop;
        },
        horizontal: function horizontal() {
          return element.scrollLeft;
        }
      }[direction];
      this.getScrollDistance = getScrollDistance;
      this.genDynamicEvents();
      this.genStaticEvents();
      var prevScrollDistance = getScrollDistance();

      var onScroll = function onScroll(e) {
        e.stopPropagation(); // body 元素的 scrollDistance 取值时不同于普通元素

        var scrollDistance = getScrollDistance();
        var direction = scrollDistance > prevScrollDistance ? DIRECTION_FORWARD : DIRECTION_BACKWARD;
        var walkParams = {
          scrollDistance: scrollDistance,
          direction: direction
        };

        _this2.walkStaticEvent(walkParams);

        _this2.walkDynamicEvents(walkParams);

        prevScrollDistance = scrollDistance;
      };

      var scrollHandler = getScrollHandler(onScroll);
      element.addEventListener(SCROLL_EVENT_NAME, scrollHandler);

      this.destroy = function () {
        return element.removeEventListener(SCROLL_EVENT_NAME, scrollHandler);
      };

      return this;
    }
  }, {
    key: "getEndReachedEvent",
    value: function getEndReachedEvent() {
      var _this3 = this;

      var _this$config2 = this.config,
          _this$config2$distanc = _this$config2.distanceToReachEnd,
          distanceToReachEnd = _this$config2$distanc === void 0 ? 100 : _this$config2$distanc,
          onEndReached = _this$config2.onEndReached,
          element = _this$config2.element,
          _this$config2$directi = _this$config2.direction,
          direction = _this$config2$directi === void 0 ? 'vertical' : _this$config2$directi;
      /**
       * 若使用触底函数，则启用相关逻辑
       */

      if (!(0, _isFunction.default)(onEndReached)) {
        return;
      } // 触底函数是否被冻结，将此值置为 true 则停止使用触底函数


      var isEndReacherFreeze = false;
      /**
       * 每次触发 onEndReached 函数后会自动阻止下一次触发，需要执行 done 函数来释放阻止
       * （例如滚动到底部后开始做网络请求时，再次滚动到底部不会触发二次请求）
       * 如果 isOver 为 true 则不会再触发后续的 onEndReached
       * （例如已经加载了全部数据，不需要再监听触底事件）
       */

      var done = function done(isOver) {
        if (!isOver) {
          isEndReacherFreeze = false;
          return;
        } else {
          if (_this3.staticEvents.length === 0 && _this3.dynamicEvents.length === 1 && _this3.dynamicEvents[0] === endReachedEvent) {
            _this3.destroy();
          }
        }
      };

      var endReachedEvent = {
        dynamic: true,
        distance: {
          vertical: function vertical() {
            return element.scrollHeight - element.offsetHeight - distanceToReachEnd;
          },
          horizontal: function horizontal() {
            return element.scrollWidth - element.offsetWidth - distanceToReachEnd;
          }
        }[direction],
        onGoingOut: function onGoingOut() {
          if (isEndReacherFreeze) return;
          isEndReacherFreeze = true;
          onEndReached(done);
        }
      };
      return endReachedEvent;
    }
  }, {
    key: "genDynamicEvents",
    value: function genDynamicEvents() {
      var _this$config$distance = this.config.distanceEvents,
          configDistanceEvents = _this$config$distance === void 0 ? [] : _this$config$distance;
      var endReachedEvent = this.getEndReachedEvent();
      var scrollDistance = this.getScrollDistance();
      var dynamicEvents = [].concat((0, _toConsumableArray2.default)(configDistanceEvents), [endReachedEvent]).filter(function (event) {
        return event && event.dynamic;
      }).map(function (event) {
        return _objectSpread(_objectSpread({}, event), {}, {
          status: scrollDistance > event.distance ? OUTSIDE : INSIDE
        });
      });
      this.dynamicEvents = dynamicEvents;
    }
  }, {
    key: "genStaticEvents",
    value: function genStaticEvents() {
      var _this$config$distance2 = this.config.distanceEvents,
          configDistanceEvents = _this$config$distance2 === void 0 ? [] : _this$config$distance2;
      var scrollDistance = this.getScrollDistance();
      var staticEvents = configDistanceEvents.map(function (event) {
        return _objectSpread(_objectSpread({}, event), {}, {
          distance: getEventDistance(event)
        });
      }).filter(function (event) {
        return event.distance >= 0 && !event.dynamic;
      }).map(function (event, idx) {
        var staticEvent = _objectSpread(_objectSpread({}, event), {}, {
          prevEvent: undefined,
          nextEvent: undefined,
          getPrevEvent: function getPrevEvent() {
            var prevEvent = staticEvents[idx - 1] || null;
            staticEvent.prevEvent = prevEvent;
            return prevEvent;
          },
          getNextEvent: function getNextEvent() {
            var nextEvent = staticEvents[idx + 1] || null;
            staticEvent.nextEvent = nextEvent;
            return nextEvent;
          },
          status: scrollDistance > event.distance ? OUTSIDE : INSIDE
        });

        return staticEvent;
      });
      this.staticEvents = staticEvents;
      this.currentStaticEvent = staticEvents.find(function (event) {
        return event.distance >= scrollDistance;
      });
    }
  }]);
  return ScrollListener;
}();

exports.default = ScrollListener;