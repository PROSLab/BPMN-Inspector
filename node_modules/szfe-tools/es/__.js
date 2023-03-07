var __ = function __(func, context) {
  return function () {
    for (var _len = arguments.length, preArgs = new Array(_len), _key = 0; _key < _len; _key++) {
      preArgs[_key] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return func.apply(context || this, preArgs.map(function (preArg) {
        return preArg === __ ? args.shift() : preArg;
      }).concat(args));
    };
  };
};

export default __;