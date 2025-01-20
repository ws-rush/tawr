import { useRef, useSyncExternalStore } from "react";
import { Store as BaseStore, Getters, GettersReturn, Actions, State } from "./store";
import { watch } from "@vue/reactivity";

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

  const accessedPaths = useRef(new Set<string>());
  const snapshotCache = useRef<StoreSnapshot<T, G> | null>(null);
  const snapshotVersion = useRef(0);

  const trackAccess = (path: Path) => {
    accessedPaths.current.add(path.join("."));
  };

  const subscribe = (onStoreChange: () => void) => {
    const paths = Array.from(accessedPaths.current);
    
    // Create Vue watchers for each accessed path
    const stopWatchers = paths.map(pathKey => {
      const path = pathKey.split(".");
      
      return watch(
        () => {
          let value: any = store;
          for (const key of path) {
            if (value === undefined || value === null) return undefined;
            value = value[key as PathKey];
            if (isLikelyComputedRef(value)) {
              value = value.value;
            }
          }
          return value;
        },
        () => {
          // Increment version to invalidate cache
          snapshotVersion.current++;
          snapshotCache.current = null;
          onStoreChange();
        },
        // @ts-expect-error Vue's watch options type doesn't include flush
        { flush: 'sync' }
      );
    });

    return () => {
      stopWatchers.forEach(stop => stop());
    };
  };

  const getSnapshot = () => {
    // Return cached snapshot if available
    if (snapshotCache.current !== null) {
      return snapshotCache.current;
    }

    // Reset accessed paths before creating new snapshot
    accessedPaths.current = new Set();
    
    // Create and cache new snapshot
    snapshotCache.current = createSnapshot(store, trackAccess);
    return snapshotCache.current;
  };

  return useSyncExternalStore(subscribe, getSnapshot);
}