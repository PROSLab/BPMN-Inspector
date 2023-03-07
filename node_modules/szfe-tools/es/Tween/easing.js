import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

// 参考 https://github.com/liriliri/licia/blob/master/src/e/easing.js

/*
 * export declare const easing: {
 *     linear(percent: number): number;
 *     inQuad(percent: number): number;
 *     outQuad(percent: number): number;
 *     inOutQuad(percent: number): number;
 *     outInQuad(percent: number): number;
 *     inCubic(percent: number): number;
 *     outCubic(percent: number): number;
 *     inQuart(percent: number): number;
 *     outQuart(percent: number): number;
 *     inQuint(percent: number): number;
 *     outQuint(percent: number): number;
 *     inExpo(percent: number): number;
 *     outExpo(percent: number): number;
 *     inSine(percent: number): number;
 *     outSine(percent: number): number;
 *     inCirc(percent: number): number;
 *     outCirc(percent: number): number;
 *     inElastic(percent: number, elasticity?: number): number;
 *     outElastic(percent: number, elasticity?: number): number;
 *     inBack(percent: number): number;
 *     outBack(percent: number): number;
 *     inOutBack(percent: number): number;
 *     outInBack(percent: number): number;
 *     inBounce(percent: number): number;
 *     outBounce(percent: number): number;
 * };
 */

/**
 * [缓动公式，网上找的，参考：http://www.cnblogs.com/brainworld/p/7240564.html]
 * @param  {[type]} pos [动画进行百分比，取值：0 - 1]
 * @return {[type]}     [description]
 */
function sinusoidal(pos) {
  return -Math.cos(pos * Math.PI) / 2 + 0.5;
}

function linear(pos) {
  return pos;
}

var easing = {
  inQuad: function inQuad(pos) {
    return Math.pow(pos, 2);
  },
  outQuad: function outQuad(pos) {
    return -(Math.pow(pos - 1, 2) - 1);
  },
  inOutQuad: function inOutQuad(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2);
    return -0.5 * ((pos -= 2) * pos - 2);
  },
  inCubic: function inCubic(pos) {
    return Math.pow(pos, 3);
  },
  outCubic: function outCubic(pos) {
    return Math.pow(pos - 1, 3) + 1;
  },
  inOutCubic: function inOutCubic(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3);
    return 0.5 * (Math.pow(pos - 2, 3) + 2);
  },
  inQuart: function inQuart(pos) {
    return Math.pow(pos, 4);
  },
  outQuart: function outQuart(pos) {
    return -(Math.pow(pos - 1, 4) - 1);
  },
  inOutQuart: function inOutQuart(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 4);
    return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
  },
  inQuint: function inQuint(pos) {
    return Math.pow(pos, 5);
  },
  outQuint: function outQuint(pos) {
    return Math.pow(pos - 1, 5) + 1;
  },
  inOutQuint: function inOutQuint(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 5);
    return 0.5 * (Math.pow(pos - 2, 5) + 2);
  },
  inSine: function inSine(pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
  },
  outSine: function outSine(pos) {
    return Math.sin(pos * (Math.PI / 2));
  },
  inOutSine: function inOutSine(pos) {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
  },
  inExpo: function inExpo(pos) {
    return pos === 0 ? 0 : Math.pow(2, 10 * (pos - 1));
  },
  outExpo: function outExpo(pos) {
    return pos === 1 ? 1 : -Math.pow(2, -10 * pos) + 1;
  },
  inOutExpo: function inOutExpo(pos) {
    if (pos === 0) return 0;
    if (pos === 1) return 1;
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (pos - 1));
    return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
  },
  inCirc: function inCirc(pos) {
    return -(Math.sqrt(1 - pos * pos) - 1);
  },
  outCirc: function outCirc(pos) {
    return Math.sqrt(1 - Math.pow(pos - 1, 2));
  },
  inOutCirc: function inOutCirc(pos) {
    if ((pos /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
    return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
  },
  outBounce: function outBounce(pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos;
    } else if (pos < 2 / 2.75) {
      return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
    } else if (pos < 2.5 / 2.75) {
      return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
    } else {
      return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
    }
  },
  inBack: function inBack(pos) {
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },
  outBack: function outBack(pos) {
    var s = 1.70158;
    return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
  },
  inOutBack: function inOutBack(pos) {
    var s = 1.70158;
    if ((pos /= 0.5) < 1) return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s));
    return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
  },
  elastic: function elastic(pos) {
    return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
  },
  swingFromTo: function swingFromTo(pos) {
    var s = 1.70158;
    return (pos /= 0.5) < 1 ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
  },
  swingFrom: function swingFrom(pos) {
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },
  swingTo: function swingTo(pos) {
    var s = 1.70158;
    return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
  },
  bounce: function bounce(pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos;
    } else if (pos < 2 / 2.75) {
      return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
    } else if (pos < 2.5 / 2.75) {
      return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
    } else {
      return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
    }
  },
  bouncePast: function bouncePast(pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos;
    } else if (pos < 2 / 2.75) {
      return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75);
    } else if (pos < 2.5 / 2.75) {
      return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375);
    } else {
      return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375);
    }
  },
  fromTo: function fromTo(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 4);
    return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
  },
  from: function from(pos) {
    return Math.pow(pos, 4);
  },
  to: function to(pos) {
    return Math.pow(pos, 0.25);
  },
  linear: linear,
  sinusoidal: sinusoidal,
  reverse: function reverse(pos) {
    var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : linear;
    return 1 - transition(pos);
  },
  mirror: function mirror(pos) {
    var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : linear;
    if (pos < 0.5) return transition(pos * 2);else return transition(1 - (pos - 0.5) * 2);
  },
  flicker: function flicker(pos) {
    var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : linear;
    pos = pos + (Math.random() - 0.5) / 5;
    return transition(pos < 0 ? 0 : pos > 1 ? 1 : pos);
  },
  wobble: function wobble(pos) {
    return -Math.cos(pos * Math.PI * (9 * pos)) / 2 + 0.5;
  },
  pulse: function pulse(pos, pulses) {
    return -Math.cos(pos * ((pulses || 5) - 0.5) * 2 * Math.PI) / 2 + 0.5;
  },
  blink: function blink(pos, blinks) {
    return Math.round(pos * (blinks || 5)) % 2;
  },
  spring: function spring(pos) {
    return 1 - Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6);
  },
  none: function none() {
    return 0;
  },
  full: function full() {
    return 1;
  }
};
var DEFAULT_ELASTICITY = 400;
var pow = Math.pow,
    sqrt = Math.sqrt,
    sin = Math.sin,
    min = Math.min,
    asin = Math.asin,
    PI = Math.PI;
var fns = {
  sine: function sine(t) {
    return 1 + sin(PI / 2 * t - PI / 2);
  },
  circ: function circ(t) {
    return 1 - sqrt(1 - t * t);
  },
  elastic: function elastic(t, m) {
    m = m || DEFAULT_ELASTICITY;
    if (t === 0 || t === 1) return t;
    var p = 1 - min(m, 998) / 1000,
        st = t / 1,
        st1 = st - 1,
        s = p / (2 * PI) * asin(1);
    return -(pow(2, 10 * st1) * sin((st1 - s) * (2 * PI) / p));
  },
  back: function back(t) {
    return t * t * (3 * t - 2);
  },
  bounce: function bounce(t) {
    var pow2,
        bounce = 4;
    /* eslint-disable no-empty */

    while (t < ((pow2 = pow(2, --bounce)) - 1) / 11) {}

    return 1 / pow(4, 3 - bounce) - 7.5625 * pow((pow2 * 3 - 2) / 22 - t, 2);
  }
};
['quad', 'cubic', 'quart', 'quint', 'expo'].forEach(function (name, i) {
  fns[name] = function (t) {
    return pow(t, i + 2);
  };
});

var upperFirst = function upperFirst(str) {
  if (str.length < 1) return str;
  return str[0].toUpperCase() + str.slice(1);
};

Object.entries(fns).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      fn = _ref2[1];

  name = upperFirst(name);
  easing["in".concat(name)] = fn;

  easing["out".concat(name)] = function (t, m) {
    return 1 - fn(1 - t, m);
  };

  easing["inOut".concat(name)] = function (t, m) {
    return t < 0.5 ? fn(t * 2, m) / 2 : 1 - fn(t * -2 + 2, m) / 2;
  };

  easing["outIn".concat(name)] = function (t, m) {
    return t < 0.5 ? (1 - fn(1 - 2 * t, m)) / 2 : (fn(t * 2 - 1, m) + 1) / 2;
  };
});
export default easing;