import { useMemo, useRef } from 'react';
import isEqual from 'lodash/isEqual';

const cachedEmptyArray: [] = [];

function useCustomCompareMemo<T>(value: T, equal: (a: T, b: T) => boolean): T {
  const ref = useRef<T>(value);

  if (!equal(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useToArray(value?: string[] | string): string[] {
  return useMemo(() => {
    if (!value) {
      return cachedEmptyArray;
    }
    return Array.isArray(value) ? value : [value];
    // custom compare for efficiently cache value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCustomCompareMemo<typeof value>(value, isEqual)]);
}
