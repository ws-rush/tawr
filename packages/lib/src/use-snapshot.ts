import { useState, useEffect, useRef } from "react";
import { watch } from "@vue/reactivity";
import { Store as BaseStore, Getters, GettersReturn, Actions, State } from "./store"; // Import necessary types

// Types
export type PathKey = string | number;
export type Path = PathKey[];

export type StoreSnapshot<T extends object, G extends Getters<T>> = State<T> & GettersReturn<G>;

// Type guard
function isStore(obj: any): obj is BaseStore<any, any, any> {
  return obj && typeof obj === "object" && "$state" in obj && "actions" in obj;
}

// Function to check if a value is likely a computed ref
function isLikelyComputedRef(value: any): boolean {
  return typeof value === 'object' && value !== null && typeof (value as any).value !== 'undefined';
}

function createSnapshot<T extends object, G extends Getters<T>>(
  store: BaseStore<T, G, any>,
  trackAccess: (path: Path) => void
): StoreSnapshot<T, G> {
  const seen = new WeakSet();

  const createProxy = (obj: any, path: Path = []): any => {
    if (typeof obj !== "object" || obj === null || seen.has(obj)) {
      return obj;
    }

    seen.add(obj);

    return new Proxy(obj, {
      get(target, key) {
        if (key === "actions" || key === "$underive" || key === "$invalidate" || key === '$state') {
          return undefined;
        }

        const currentPath = [...path, key as PathKey];
        trackAccess(currentPath);

        const value = target[key];
        if (isLikelyComputedRef(value)) {
          return (value as any).value; // Access the computed value
        }
        if (typeof value === "function") {
          return value.bind(target);
        }

        return createProxy(value, currentPath);
      },
      set() {
        return false; // Immutable
      },
      deleteProperty() {
        return false; // Immutable
      },
    });
  };

  return createProxy(store) as StoreSnapshot<T, G>;
}

export function useSnapshot<T extends object, G extends Getters<T>, A extends Actions>(
  store: BaseStore<T, G, A>
): StoreSnapshot<T, G> {
  if (!isStore(store)) {
    throw new Error("useSnapshot requires a store created with defineStore()");
  }

  const [, forceUpdate] = useState(0);
  const accessedPaths = useRef(new Set<string>());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const trackAccess = (path: Path) => {
    accessedPaths.current.add(path.join("."));
  };

  useEffect(() => {
    const paths = Array.from(accessedPaths.current);
    const cleanups: (() => void)[] = [];

    paths.forEach((pathKey) => {
      const path = pathKey.split(".");
      const stopWatch = watch(
        () => {
          let value: any = store;
          for (const key of path) {
            value = value[key as PathKey];
          }
          return value;
        },
        () => {
          if (mountedRef.current) {
            forceUpdate((n) => n + 1);
          }
        },
        // @ts-expect-error
        { flush: "sync" }
      );
      cleanups.push(stopWatch);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [store]);

  accessedPaths.current = new Set();
  return createSnapshot(store, trackAccess);
}