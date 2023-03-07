"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var CombJubge = function CombJubge(list) {
  var _this = this;

  (0, _classCallCheck2.default)(this, CombJubge);

  this.have = function (activeAttr) {
    return Object.values(_this.list).some(function (item) {
      return Object.entries(activeAttr).every(function (_ref) {
        var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
            key = _ref2[0],
            val = _ref2[1];

        return item[key] === val;
      });
    });
  };

  this.adaptedAttr = function (activeAttr) {
    return Object.entries(_this.attr).reduce(function (adaptedAttr, _ref3) {
      var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
          key = _ref4[0],
          values = _ref4[1];

      return Object.assign(adaptedAttr, (0, _defineProperty2.default)({}, key, values.filter(function (val) {
        return _this.have(Object.assign({}, activeAttr, (0, _defineProperty2.default)({}, key, val)));
      })));
    }, {});
  };

  this.find = function (activeAttr) {
    var _loop = function _loop() {
      var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
          id = _Object$entries$_i[0],
          item = _Object$entries$_i[1];

      if (Object.entries(activeAttr).every(function (_ref5) {
        var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
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

      if ((0, _typeof2.default)(_ret) === "object") return _ret.v;
    }
  };

  this.list = list;
  this.attr = Object.entries(list).reduce(function (attr, _ref7) {
    var _ref8 = (0, _slicedToArray2.default)(_ref7, 2),
        item = _ref8[1];

    Object.entries(item).forEach(function (_ref9) {
      var _ref10 = (0, _slicedToArray2.default)(_ref9, 2),
          key = _ref10[0],
          val = _ref10[1];

      attr[key] = attr[key] || [];
      attr[key] = (0, _toConsumableArray2.default)(new Set([].concat((0, _toConsumableArray2.default)(attr[key]), [val])));
    });
    return attr;
  }, {});
  this.attrKey = Object.keys(this.attr);
};

exports.default = CombJubge;