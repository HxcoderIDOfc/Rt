(() => {
  const originalSetTimeout = window.setTimeout.bind(window);
  let splashBypassActive = true;

  const style = document.createElement('style');
  style.textContent = '.splash-screen{display:none!important}';
  document.head.appendChild(style);

  window.setTimeout = (callback, delay, ...args) => {
    if (splashBypassActive && Number(delay) === 750) {
      splashBypassActive = false;
      return originalSetTimeout(callback, 0, ...args);
    }
    return originalSetTimeout(callback, delay, ...args);
  };
})();
