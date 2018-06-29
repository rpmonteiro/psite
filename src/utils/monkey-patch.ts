function dispatchPushStateEvent() {
  const event = new Event('pushstate');
  window.dispatchEvent(event);
}

export function pushStateMonkeyPatch() {
  const daRealPushState = history.pushState;
  history.pushState = function () {
    daRealPushState.apply(history, arguments);
    dispatchPushStateEvent();
  };
}
