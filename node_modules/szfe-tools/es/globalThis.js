import _typeof from "@babel/runtime/helpers/esm/typeof";

/* ts-ignore */
var getImplementation = function getImplementation() {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  } // @ts-ignore


  if (typeof global !== 'undefined') {
    // @ts-ignore
    return global;
  }

  return Function('return this')();
};

var implementation = getImplementation();

var getGlobal = function getGlobal() {
  if ( // @ts-ignore
  (typeof global === "undefined" ? "undefined" : _typeof(global)) !== 'object' || // @ts-ignore
  !global || // @ts-ignore
  global.Math !== Math || // @ts-ignore
  global.Array !== Array) {
    return implementation;
  } // @ts-ignore


  return global; // return implementation
};

var globalThis = getGlobal();
export default globalThis;