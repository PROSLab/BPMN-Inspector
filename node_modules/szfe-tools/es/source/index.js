import getExternals from './getExternals'; // 增加 source 缓存，防止多次加载同一资源

var cache = {
  js: [],
  css: []
};
export var js = function js(src, externals) {
  if (cache.js.includes(src)) {
    console.warn("[source.js] ".concat(src, " \u5DF2\u88AB\u52A0\u8F7D"));
    return Promise.resolve(getExternals(src, externals));
  }

  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.addEventListener('load', function () {
      return setTimeout(function () {
        cache.js.push(src);
        resolve(getExternals(src, externals));
      });
    });
    script.addEventListener('error', reject);
    document.body.appendChild(script);
  });
};
export var css = function css(href) {
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
export default {
  js: js,
  css: css
};