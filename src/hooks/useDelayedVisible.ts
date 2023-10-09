import { useEffect, useReducer, useRef } from 'react';

/**
 * A hook that helps loading spinners decide whether to display or not.
 * By default, it will delay displaying 350ms.
 * If the "loading" process is done before 350ms, there is no need to display
 *
 * If the loading spinner is shown (i.e loading took longer than 350ms)
 * We ensure that the spinner stays visible for at least 500ms to avoid janky UI:s
 *
 * Adjust delayMs and showAtLeastMs to tweak the behaviour.
 * Use initialVisible if you want the spinner to display on first render (i.e ignore waiting for the first 300ms)
 */
export function useDelayedVisible(
  visible: boolean,
  initialVisible?: boolean,
  delayMs = 350,
  showAtLeastMs = 500,
) {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const showingRef = useRef(initialVisible ?? visible);
  const showingTimeRef = useRef(Date.now());
  useEffect(() => {
    let timerId: number;

    if (visible) {
      // If we were showing already, we can exit
      if (showingRef.current) {
        return;
      }
      // Show after a delay
      timerId = window.setTimeout(() => {
        showingTimeRef.current = Date.now();
        showingRef.current = true;
        forceUpdate();
      }, delayMs);
    } else {
      // If we were hiding already, we can exit
      if (!showingRef.current) {
        return;
      }
      const timeShownMs = Date.now() - showingTimeRef.current;
      if (timeShownMs >= showAtLeastMs) {
        // If we have been visible for the minimum duration, we hide
        showingRef.current = false;
        forceUpdate();
      } else {
        const closingInMs = showAtLeastMs - timeShownMs;
        // Close after a delay (with respect to minimum duration)
        timerId = window.setTimeout(() => {
          showingRef.current = false;
          forceUpdate();
        }, closingInMs);
      }
    }
    return () => {
      clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  return showingRef.current;
}
