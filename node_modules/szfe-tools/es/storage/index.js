import isNull from '../isNull';
import root from '../globalThis';
import withSupportive from './withSupportive';

var getter = function getter(storage) {
  return withSupportive(function (key) {
    var data = storage.getItem(key);
    var result;

    if (data === 'undefined' || isNull(data)) {
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
  return withSupportive(function (key, value) {
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
  return withSupportive(function (key) {
    storage.removeItem(key);
  });
};

export var get = getter(root.localStorage);
export var set = setter(root.localStorage);
export var remove = remover(root.localStorage);
export var getSession = getter(root.sessionStorage);
export var setSession = setter(root.sessionStorage);
export var removeSession = remover(root.sessionStorage);
export default {
  get: get,
  set: set,
  remove: remove,
  getSession: getSession,
  setSession: setSession,
  removeSession: removeSession
};