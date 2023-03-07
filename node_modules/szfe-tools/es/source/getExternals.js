import isArray from '../isArray';
import isUndefined from '../isUndefined';
import root from '../globalThis';
import curry from '../curry';
var getExt = curry(function (src, key) {
  var ext = root[key];
  !isUndefined(key) && isUndefined(ext) && console.warn("No external named '".concat(key, "' in global after loaded ").concat(src));
  return ext;
});

var getExternals = function getExternals(src, externals) {
  return isArray(externals) ? externals.map(getExt(src)) : getExt(src, externals);
};

export default getExternals;