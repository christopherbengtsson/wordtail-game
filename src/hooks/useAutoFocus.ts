import { useRef, useEffect } from 'react';

export function useAutoFocus(focus?: boolean) {
  const ref = useRef<HTMLHeadingElement>(null);
  const tabIndex = focus ? -1 : undefined;

  useEffect(() => {
    if (ref.current && focus) {
      ref.current.focus();
    }
  }, [focus]);

  return { ref, tabIndex };
}
