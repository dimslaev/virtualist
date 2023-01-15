export const throttle = (fn, time = 200) => {
  let active = false;
  return function () {
    if (!active) {
      active = true;
      fn.apply(this, arguments);
      setTimeout(function () {
        active = false;
      }, time);
    }
  };
};
