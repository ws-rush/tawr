import { useState, useEffect } from "react";
import { readonly, watch } from "@vue/reactivity";

export function useObserve<T>(value: T): T {
  // Handle primitive values directly since they're already immutable
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

  return state as T;
}
