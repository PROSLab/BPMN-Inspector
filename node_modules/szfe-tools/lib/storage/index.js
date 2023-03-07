"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.removeSession = exports.setSession = exports.getSession = exports.remove = exports.set = exports.get = void 0;

var _isNull = _interopRequireDefault(require("../isNull"));

var _globalThis = _interopRequireDefault(require("../globalThis"));

var _withSupportive = _interopRequireDefault(require("./withSupportive"));

var getter = function getter(storage) {
  return (0, _withSupportive.default)(function (key) {
    var data = storage.getItem(key);
    var result;

    if (data === 'undefined' || (0, _isNull.default)(data)) {
      result = undefined;
    } else {
      try {
        result = JSON.parse(data);
      } catch (err) {
        console.error('[ERROR storage.get --> JSON.parse]', err);
        result = data;
      }
    }

    return result;
  });
};

var setter = function setter(storage) {
  return (0, _withSupportive.default)(function (key, value) {
    var data;

    try {
      data = JSON.stringify(value);
    } catch (err) {
      console.error('[ERROR storage.set --> JSON.stringify]', err);
      data = value;
    }

    storage.setItem(key, data);
    return data;
  });
};

var remover = function remover(storage) {
  return (0, _withSupportive.default)(function (key) {
    storage.removeItem(key);
  });
};

var get = getter(_globalThis.default.localStorage);
exports.get = get;
var set = setter(_globalThis.default.localStorage);
exports.set = set;
var remove = remover(_globalThis.default.localStorage);
exports.remove = remove;
var getSession = getter(_globalThis.default.sessionStorage);
exports.getSession = getSession;
var setSession = setter(_globalThis.default.sessionStorage);
exports.setSession = setSession;
var removeSession = remover(_globalThis.default.sessionStorage);
exports.removeSession = removeSession;
var _default = {
  get: get,
  set: set,
  remove: remove,
  getSession: getSession,
  setSession: setSession,
  removeSession: removeSession
};
exports.default = _default;