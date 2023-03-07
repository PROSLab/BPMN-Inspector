"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _get = _interopRequireDefault(require("./get"));

var _run = _interopRequireDefault(require("./run"));

var _isArray = _interopRequireDefault(require("./isArray"));

var _isObject = _interopRequireDefault(require("./isObject"));

var _isFunction = _interopRequireDefault(require("./isFunction"));

var _memoize = _interopRequireDefault(require("./memoize"));

var _EventBus = _interopRequireDefault(require("./EventBus"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var NSReg = /:/;

var I18n =
/** @class */
function () {
  var I18n = function I18n(config) {
    var _this = this;

    (0, _classCallCheck2.default)(this, I18n);
    this.resources = {};
    this.language = undefined;
    this.eventBus = new _EventBus.default();

    this.applyLanguage = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(language) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (language) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                _context2.next = 4;
                return Promise.all(Object.entries(_this.config.types).map( /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_ref2) {
                    var _ref4, type, resources;

                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _ref4 = (0, _slicedToArray2.default)(_ref2, 2), type = _ref4[0], resources = _ref4[1].resources;

                            if (!_this.resources[type]) {
                              _this.resources[type] = {};
                            }

                            _context.next = 4;
                            return (0, _run.default)((0, _get.default)(resources, language, resources));

                          case 4:
                            _this.resources[type][language] = _context.sent;

                          case 5:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 4:
                _this.language = language;

                _this.eventBus.emit('change', language);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    this.translate = function (str) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var useNamespace = NSReg.test(str);

      var _str$split = str.split('@'),
          _str$split2 = (0, _slicedToArray2.default)(_str$split, 2),
          _keys = _str$split2[0],
          _str$split2$ = _str$split2[1],
          type = _str$split2$ === void 0 ? _this.config.defaultType || 'default' : _str$split2$;

      var keys = _keys;
      var namespace;

      if (useNamespace) {
        ;

        var _keys$split = _keys.split(':');

        var _keys$split2 = (0, _slicedToArray2.default)(_keys$split, 2);

        namespace = _keys$split2[0];
        keys = _keys$split2[1];
      }

      if (!useNamespace && _this.language) {
        var format = (0, _get.default)(_this.config, "types.".concat(type, ".format.").concat(_this.language), (0, _get.default)(_this.config, "types.".concat(type, ".format"), I18n.template));
        var useResource = (0, _get.default)(_this.resources, "".concat(type, ".").concat(_this.language)) !== false;

        if ((0, _isFunction.default)(format)) {
          var res = (0, _run.default)(format, undefined, useResource ? (0, _get.default)(_this.resources, "".concat(type, ".").concat(_this.language, ".").concat(keys)) : keys, options);

          if (res) {
            return res;
          }
        }
      }

      return _this.fallbackTranslate("".concat(keys, "@").concat(type), options, namespace) || keys;
    };

    this.fallbackTranslate = function (str, options, namespace) {
      if (!(0, _isArray.default)(_this.config.fallback) && !(0, _isObject.default)(_this.config.fallback)) {
        return undefined;
      }

      var fallbackOptions = _objectSpread(_objectSpread({}, options), {}, {
        _fbT: true
      });

      if (namespace) {
        var res = (0, _run.default)(_this.config.fallback, "".concat(namespace, ".t"), str, fallbackOptions);

        if (res) {
          return res;
        }
      } else {
        for (var _i = 0, _Object$values = Object.values(_this.config.fallback); _i < _Object$values.length; _i++) {
          var i18n = _Object$values[_i];

          var _res = i18n.t(str, fallbackOptions);

          if (_res) {
            return _res;
          }
        }
      }

      if (options._fbT) {
        return undefined;
      }
    };

    this.t = this.translate;
    this.config = config;
    I18n.instances.push(this);

    if (I18n.language) {
      this.applyLanguage(I18n.language);
    } else {
      I18n.eventBus.once('change', function (language) {
        _this.applyLanguage(I18n.language);
      });
    }
  };

  I18n.instances = [];
  I18n.language = undefined;
  I18n.eventBus = new _EventBus.default();
  /**
   * [template 简易字符串模板函数]
   * e.g: template('hello {{name}}', { name: 'CJY' }) ==> 'hello CJY'
   * @param  {[字符串]} str  [description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */

  I18n.template = function () {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var data = arguments.length > 1 ? arguments[1] : undefined;
    var exp = /\{\{\s*\w*\s*\}\}/g,
        keys = str.match(exp) || {};
    Object.keys(keys).forEach(function (_k) {
      var key = keys[_k].replace(/\{\{\s*/, '').replace(/\s*\}\}/, '');

      str = str.replace(new RegExp("\\{\\{".concat(key, "\\}\\}"), 'g'), (0, _get.default)(data, key));
    });
    return str;
  };

  I18n.load = function () {
    for (var _len = arguments.length, loaders = new Array(_len), _key = 0; _key < _len; _key++) {
      loaders[_key] = arguments[_key];
    }

    return (0, _memoize.default)( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.t0 = Object.assign;
              _context4.t1 = Object;
              _context4.t2 = [{}];
              _context4.t3 = _toConsumableArray2.default;
              _context4.next = 6;
              return Promise.all(loaders.map( /*#__PURE__*/function () {
                var _ref6 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(loader) {
                  var res;
                  return _regenerator.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return (0, _run.default)(loader);

                        case 2:
                          res = _context3.sent;
                          return _context3.abrupt("return", (0, _get.default)(res, 'default', res));

                        case 4:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function (_x3) {
                  return _ref6.apply(this, arguments);
                };
              }()));

            case 6:
              _context4.t4 = _context4.sent;
              _context4.t5 = (0, _context4.t3)(_context4.t4);
              _context4.t6 = _context4.t2.concat.call(_context4.t2, _context4.t5);
              return _context4.abrupt("return", _context4.t0.apply.call(_context4.t0, _context4.t1, _context4.t6));

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  };

  I18n.applyLanguage = /*#__PURE__*/function () {
    var _ref7 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(language) {
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (language) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt("return");

            case 2:
              _context5.next = 4;
              return Promise.all(I18n.instances.map(function (instance) {
                return instance.applyLanguage(language);
              }));

            case 4:
              I18n.language = language;
              I18n.eventBus.emit('change', language);

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x4) {
      return _ref7.apply(this, arguments);
    };
  }();

  return I18n;
}();

var _default = I18n;
exports.default = _default;