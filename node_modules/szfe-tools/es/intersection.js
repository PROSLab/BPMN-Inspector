import pipe from './pipe';
import flatten from './flatten';
/**
 * [交集]
 * 示例：intersection([1, 2], [2, 3]) => [2]
 */

var intersection = function intersection() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return pipe(flatten, function (_) {
    return new Set(_);
  }, Array.from)(args).filter(function (item) {
    return args.every(function (arr) {
      return arr.includes(item);
    });
  });
};

export default intersection;