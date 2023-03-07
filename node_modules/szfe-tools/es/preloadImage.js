var preloadImage = function preloadImage(srcList) {
  return srcList.forEach(function (src) {
    var img = new Image();
    img.src = src;
  });
};

export default preloadImage;