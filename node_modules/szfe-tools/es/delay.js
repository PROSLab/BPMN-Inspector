var delay = function delay(time) {
  return new Promise(function (resolve) {
    if (time === Infinity) {
      // Never resolve
      return;
    }

    setTimeout(resolve, time);
  });
};

export default delay;