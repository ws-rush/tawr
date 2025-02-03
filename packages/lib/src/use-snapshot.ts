import { useState, useRef, useEffect } from "react";
import { readonly, watch } from "@vue/reactivity";
import { Actions, Getters, Store } from "./store";

export function useSnapshot<T extends object, G extends Getters<T>, A extends Actions<T, G>>(store: Store<T, G, A>): Store<T, G, A> {
  const state = readonly(store) as Store<T, G, A>;
  const usedKeys = useRef(new Set<string>()); // Tracks accessed keys
  const [, forceRender] = useState(0); // Triggers re-renders

  // Recursive proxy to track deeply nested properties
  function createProxy(target: any, path = ""): any {
    return new Proxy(target, {
      get(obj, key: string) {
        if (typeof key !== "string") return obj[key]; // Ignore Symbols

        if (typeof obj[key] === "object" && obj[key] !== null) {
          return createProxy(obj[key], `${path}${key}.`); // Track deep paths
        }
        
        usedKeys.current.add(`${path}${key}`); // Track key access
        return typeof obj[key] == 'function' ? obj[key].bind(target) : obj[key];
      },
    });
  }

  const proxy = createProxy(state);

  useEffect(() => {
    // Watch only accessed keys (deep paths)
    const stopWatch = watch(
      () =>
        Array.from(usedKeys.current).map((key) =>
          key.split(".").reduce((acc: any, k) => acc?.[k], state)
        ),
      () => {
        forceRender((c) => c + 1); // Trigger re-render
      }
    );

    return () => stopWatch(); // Cleanup on unmount
  }, []);

  return proxy; // Return deep-tracking proxy
}
