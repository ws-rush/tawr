import { useState, useEffect, useRef } from 'react';
import { effect } from '@vue/reactivity';

export function useObserve<T>(getter: () => T): T {
  // Store the getter in a ref so its identity is stable within the hook.
  const getterRef = useRef(getter);
  // Always update the current getter reference.
  getterRef.current = getter;

  const [, forceUpdate] = useState(0);

  // Compute the current value (this will be stale until forceUpdate re-renders, but that’s okay)
  const value = getterRef.current();

  useEffect(() => {
    const stopEffect = effect(() => {
      const val = getterRef.current();

      if (Array.isArray(val)) {
        // Access each item to establish reactivity
        val.forEach(item => {
          if (item && typeof item === 'object') {
            Object.keys(item).forEach(key => {
              // Access each property so that the dependency is tracked
              // @ts-expect-error
              const _ = item[key];
            });
          }
        });
      } else if (val && typeof val === 'object') {
        // For objects, recursively access all properties
        const accessProperties = (obj: any) => {
          Object.keys(obj).forEach(key => {
            const child = obj[key];
            if (child && typeof child === 'object') {
              accessProperties(child);
            } else {
              // Simply reading the primitive is enough
              // @ts-expect-error
              const dummy = child;
            }
          });
        };
        accessProperties(val);
      } else {
        // For primitives, just read the value
        // @ts-expect-error
        const dummy = val;
      }

      // Force a re-render when any reactive dependency changes.
      forceUpdate(v => v + 1);
    });

    return () => stopEffect();
  }, []); // Empty dependency array: we only set up the effect once.

  return value;
}
