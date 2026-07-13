import { useCallback, useRef } from 'react';

/**
 * Returns a debounced version of the callback.
 * Only the latest invocation fires after `delay` ms of inactivity.
 */
export function useDebounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [delay],
  ) as T;

  return debouncedFn;
}
