var curry = function curry(fn) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.length < fn.length ? curry(fn.bind.apply(fn, [this].concat(args))) : fn.apply(this, args);
  };
};

export default curry;