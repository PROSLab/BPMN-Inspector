var uniqByKey = function uniqByKey() {
  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var cache = {};
  return array.filter(function (item) {
    if (!(key in item)) {
      return true;
    }

    var value = item[key];

    if (value in cache) {
      return false;
    }

    cache[value] = true;
    return true;
  });
};

export default uniqByKey;