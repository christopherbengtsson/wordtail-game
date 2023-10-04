import { useEffect, useRef, useState } from 'react';

export function useStateIfMounted<T>(initialValue: T) {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [state, setState] = useState(initialValue);

  const setStateIfMounted = (value: T) => {
    if (isMountedRef.current === true) {
      setState(value);
    }
  };

  return [state, setStateIfMounted] as const;
}
