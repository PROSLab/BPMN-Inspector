import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";

var CombJubge = function CombJubge(list) {
  var _this = this;

  _classCallCheck(this, CombJubge);

  this.have = function (activeAttr) {
    return Object.values(_this.list).some(function (item) {
      return Object.entries(activeAttr).every(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            val = _ref2[1];

        return item[key] === val;
      });
    });
  };

  this.adaptedAttr = function (activeAttr) {
    return Object.entries(_this.attr).reduce(function (adaptedAttr, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          values = _ref4[1];

      return Object.assign(adaptedAttr, _defineProperty({}, key, values.filter(function (val) {
        return _this.have(Object.assign({}, activeAttr, _defineProperty({}, key, val)));
      })));
    }, {});
  };

  this.find = function (activeAttr) {
    var _loop = function _loop() {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          id = _Object$entries$_i[0],
          item = _Object$entries$_i[1];

      if (Object.entries(activeAttr).every(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            key = _ref6[0],
            val = _ref6[1];

        return item[key] === val;
      }) && Object.keys(item).every(function (key) {
        return key in activeAttr;
      })) {
        return {
          v: id
        };
      }
    };

    for (var _i = 0, _Object$entries = Object.entries(_this.list); _i < _Object$entries.length; _i++) {
      var _ret = _loop();

      if (_typeof(_ret) === "object") return _ret.v;
    }
  };

  this.list = list;
  this.attr = Object.entries(list).reduce(function (attr, _ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        item = _ref8[1];

    Object.entries(item).forEach(function (_ref9) {
      var _ref10 = _slicedToArray(_ref9, 2),
          key = _ref10[0],
          val = _ref10[1];

      attr[key] = attr[key] || [];
      attr[key] = _toConsumableArray(new Set([].concat(_toConsumableArray(attr[key]), [val])));
    });
    return attr;
  }, {});
  this.attrKey = Object.keys(this.attr);
};

export { CombJubge as default };