var nextTick = function nextTick(func) {
  return Promise.resolve().then(func);
};

export default nextTick;