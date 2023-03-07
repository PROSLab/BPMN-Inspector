import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import get from './get';
import run from './run';
import isArray from './isArray';
import isObject from './isObject';
import isFunction from './isFunction';
import memoize from './memoize';
import EventBus from './EventBus';
var NSReg = /:/;

var I18n =
/** @class */
function () {
  var I18n = function I18n(config) {
    var _this = this;

    _classCallCheck(this, I18n);

    this.resources = {};
    this.language = undefined;
    this.eventBus = new EventBus();

    this.applyLanguage = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(language) {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref2) {
                    var _ref4, type, resources;

                    return _regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _ref4 = _slicedToArray(_ref2, 2), type = _ref4[0], resources = _ref4[1].resources;

                            if (!_this.resources[type]) {
                              _this.resources[type] = {};
                            }

                            _context.next = 4;
                            return run(get(resources, language, resources));

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
          _str$split2 = _slicedToArray(_str$split, 2),
          _keys = _str$split2[0],
          _str$split2$ = _str$split2[1],
          type = _str$split2$ === void 0 ? _this.config.defaultType || 'default' : _str$split2$;

      var keys = _keys;
      var namespace;

      if (useNamespace) {
        ;

        var _keys$split = _keys.split(':');

        var _keys$split2 = _slicedToArray(_keys$split, 2);

        namespace = _keys$split2[0];
        keys = _keys$split2[1];
      }

      if (!useNamespace && _this.language) {
        var format = get(_this.config, "types.".concat(type, ".format.").concat(_this.language), get(_this.config, "types.".concat(type, ".format"), I18n.template));
        var useResource = get(_this.resources, "".concat(type, ".").concat(_this.language)) !== false;

        if (isFunction(format)) {
          var res = run(format, undefined, useResource ? get(_this.resources, "".concat(type, ".").concat(_this.language, ".").concat(keys)) : keys, options);

          if (res) {
            return res;
          }
        }
      }

      return _this.fallbackTranslate("".concat(keys, "@").concat(type), options, namespace) || keys;
    };

    this.fallbackTranslate = function (str, options, namespace) {
      if (!isArray(_this.config.fallback) && !isObject(_this.config.fallback)) {
        return undefined;
      }

      var fallbackOptions = _objectSpread(_objectSpread({}, options), {}, {
        _fbT: true
      });

      if (namespace) {
        var res = run(_this.config.fallback, "".concat(namespace, ".t"), str, fallbackOptions);

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
  I18n.eventBus = new EventBus();
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

      str = str.replace(new RegExp("\\{\\{".concat(key, "\\}\\}"), 'g'), get(data, key));
    });
    return str;
  };

  I18n.load = function () {
    for (var _len = arguments.length, loaders = new Array(_len), _key = 0; _key < _len; _key++) {
      loaders[_key] = arguments[_key];
    }

    return memoize( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.t0 = Object.assign;
              _context4.t1 = Object;
              _context4.t2 = [{}];
              _context4.t3 = _toConsumableArray;
              _context4.next = 6;
              return Promise.all(loaders.map( /*#__PURE__*/function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(loader) {
                  var res;
                  return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return run(loader);

                        case 2:
                          res = _context3.sent;
                          return _context3.abrupt("return", get(res, 'default', res));

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
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(language) {
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
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

export default I18n;