import run from './run';

var pipe = function pipe() {
  for (var _len = arguments.length, handlers = new Array(_len), _key = 0; _key < _len; _key++) {
    handlers[_key] = arguments[_key];
  }

  return function (arg) {
    return handlers.reduce(function (res, handler) {
      return run(handler, undefined, res);
    }, arg);
  };
};

export default pipe;