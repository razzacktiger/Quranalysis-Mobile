// Polyfill for AbortSignal.any (not available in React Native)
// Required for Firebase AI SDK

if (typeof AbortSignal !== 'undefined' && !AbortSignal.any) {
  AbortSignal.any = function (signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort(signal.reason);
        return controller.signal;
      }

      signal.addEventListener(
        'abort',
        () => controller.abort(signal.reason),
        { once: true }
      );
    }

    return controller.signal;
  };
}
