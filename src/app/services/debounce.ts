/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState, useEffect } from 'react';
import type { EffectCallback, DependencyList } from 'react';

export const useDebounce = <V>(value: V, delay = 1000): V => {
  const [debounceValue, setDebounceValue] = useState<V>(value);

  useEffect(() => {
    const set = setTimeout(() => {
      setDebounceValue({ ...value });
    }, delay);

    return () => { clearTimeout(set); };
  }, [value, delay]);

  return debounceValue;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounceCallback = (fnc: EffectCallback | any, deps?: DependencyList, delay = 1000): void => {
  useEffect(() => {
    const handler = setTimeout(fnc, delay);

    return () => { clearTimeout(handler); };
  }, [...(deps || []), delay]);
};
