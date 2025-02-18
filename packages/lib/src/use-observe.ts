
import { useState, useEffect, useRef } from 'react';
import { effect } from '@vue/reactivity';

export function useObserve<T>(getter: () => T): T {
  // Store the getter in a ref so its identity is stable within the hook.
  const getterRef = useRef(getter);
  // Always update the current getter reference.
  getterRef.current = getter;

  const [, forceUpdate] = useState(0);

  // Compute the current value (this will be stale until forceUpdate re-renders, but that's okay)
  const value = getterRef.current();

  useEffect(() => {
    const stopEffect = effect(() => {
      const val = getterRef.current();

      // Helper function to recursively track reactive properties
      const trackReactivity = <V>(obj: V): void => {
        if (Array.isArray(obj)) {
          obj.forEach(item => {
            if (item && typeof item === 'object') {
              trackReactivity(item);
            }
          });
        } else if (obj && typeof obj === 'object') {
          // Use type parameter to preserve exact types
          const entries = Object.entries(obj as object);
          for (const [key, value] of entries) {
            // Track the value by accessing it
            void (obj as any)[key];
            // Recursively track nested objects
            if (value && typeof value === 'object') {
              trackReactivity(value);
            }
          }
        }
      };

      // Track all reactive properties
      trackReactivity(val);
      
      // Force a re-render when any reactive dependency changes
      forceUpdate(v => v + 1);
    });

    return () => stopEffect();
  }, []); // Empty dependency array: we only set up the effect once.

  return value;
}
