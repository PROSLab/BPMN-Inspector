"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.css = exports.js = void 0;

var _getExternals = _interopRequireDefault(require("./getExternals"));

// 增加 source 缓存，防止多次加载同一资源
var cache = {
  js: [],
  css: []
};

var js = function js(src, externals) {
  if (cache.js.includes(src)) {
    console.warn("[source.js] ".concat(src, " \u5DF2\u88AB\u52A0\u8F7D"));
    return Promise.resolve((0, _getExternals.default)(src, externals));
  }

  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.addEventListener('load', function () {
      return setTimeout(function () {
        cache.js.push(src);
        resolve((0, _getExternals.default)(src, externals));
      });
    });
    script.addEventListener('error', reject);
    document.body.appendChild(script);
  });
};

exports.js = js;

var css = function css(href) {
  if (cache.css.includes(href)) {
    console.warn("[source.css] ".concat(href, " \u5DF2\u88AB\u52A0\u8F7D"));
    return;
  }

  if (document.querySelector("link[href=\"".concat(href, "\"]"))) {
    cache.css.push(href);
    return;
  }

  var link = document.createElement('link');
  link.setAttribute('href', href);
  link.setAttribute('rel', 'stylesheet');
  document.body.appendChild(link);
  cache.css.push(href);
};

exports.css = css;
var _default = {
  js: js,
  css: css
};
exports.default = _default;