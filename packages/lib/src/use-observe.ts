import { useState, useEffect } from "react";
import { readonly, watch } from "@vue/reactivity";

type ObservableValue<T> = T extends Array<infer U> ? U[] : T;

export function useObserve<T>(value: T): ObservableValue<T> {
  // Handle array of functions
  if (Array.isArray(value)) {
    const states = value.map(v => 
      typeof v === 'object' && v !== null ? readonly(v) : v
    );
    const [, forceRender] = useState(0);

    useEffect(() => {
      const stops = states.map((state, index) => {
        // For primitive values, we don't need to watch
        if (typeof value[index] !== 'object' || value[index] === null) {
          return null;
        }
        
        return watch(
          () => state,
          () => {
            forceRender(c => c + 1);
          },
          { deep: true }
        );
      });

      return () => {
        stops.forEach(stop => stop?.());
      };
    }, []);

    return states as ObservableValue<T>;
  }

  // Handle single value
  const state = typeof value === 'object' && value !== null ? readonly(value) : value;
  const [, forceRender] = useState(0);

  useEffect(() => {
    // For primitive values, we don't need to watch since they're immutable
    if (typeof value !== 'object' || value === null) {
      return;
    }
    
    const stop = watch(
      () => state,
      () => {
        forceRender(c => c + 1);
      },
      { deep: true }
    );

    return () => {
      stop();
    };
  }, []);

  return state as ObservableValue<T>;
}
