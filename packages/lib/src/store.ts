import { reactive, computed } from "@vue/reactivity";
import { useSnapshot, UseStoreSnapshot } from "./use-snapshot";

// 1) The store shape that each action will see as `this`.
type StoreContext<T, G> = T & { $state: T } & GettersReturn<G> & {
    $underive(keys: (keyof GettersReturn<G>)[]): void;
    $invalidate(keys: (keyof GettersReturn<G>)[]): void;
  };

// 2) Actions now require their `this` to be that StoreContext.
export type Actions<T extends object, G extends Getters<T>> = {
  [K: string]: (this: StoreContext<T, G>, ...args: any[]) => any;
};

// Reuse your existing definitions for Getters, State, etc.
export type GettersReturn<G> = {
  [K in keyof G]: G[K] extends (...args: any[]) => infer R ? R : never;
};

export type State<T> = {
  [K in keyof T]-?: T[K];
};

export type StoreState<T> = T & { $state: T };

export type Getters<T> = {
  [K: string]: (store: T & { $state: T } & { [K in keyof Getters<T>]: ReturnType<Getters<T>[K]> }) => any;
};

// 3) For the final store, from “external usage,” actions
//    become methods that do not expose a `this` parameter.
export type Store<
  T extends object,
  G extends Getters<T>,
  A extends Actions<T, G>
> = T & { $state: T } & GettersReturn<G> & {
    actions: {
      [K in keyof A]: A[K] extends (this: any, ...args: infer P) => infer R
        ? (...args: P) => R
        : never;
    };
    $underive(keys: (keyof GettersReturn<G>)[]): void;
    $invalidate(keys: (keyof GettersReturn<G>)[]): void;
  };

export type StoreDefinition<
  T extends object,
  G extends Getters<T> = Getters<T>,
  A extends Actions<T, G> = Actions<T, G>
> = {
  state?(): T;
  getters?: G;
  actions?: A;
};

// 4) Implementation mostly unchanged—only subtle type tweaks:
export function defineStore<
  T extends object,
  G extends Getters<T> = Getters<T>,
  A extends Actions<T, G> = Actions<T, G>
>(
  definition: StoreDefinition<T, G, A>
): [UseStoreSnapshot<T, G>, Store<T, G, A>] {
  const initialState = definition.state?.() ?? {};
  const state = reactive(initialState) as T;

  const store = {
    $state: state,
    $underive(keys: (keyof GettersReturn<G>)[]) {
      keys.forEach((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(store, key);
        if (descriptor && typeof descriptor.get === "function") {
          const currentValue = descriptor.get.call(store);
          Object.defineProperty(store, key, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: currentValue,
          });
        }
      });
    },
    $invalidate(keys: (keyof GettersReturn<G>)[]) {
      keys.forEach((key) => {
        if (definition.getters && key in definition.getters) {
          const fn = definition.getters[key];
          const computedRef = computed(() => {
            return fn(store as StoreState<T>);
          });
          Object.defineProperty(store, key, {
            get: () => computedRef.value,
            enumerable: true,
            configurable: true,
          });
        }
      });
    }
  } as unknown as Store<T, G, A>;

  // Attach state properties
  Object.keys(state).forEach((key) => {
    Object.defineProperty(store, key, {
      get: () => state[key as keyof T],
      set: (value) => {
        state[key as keyof T] = value;
      },
      enumerable: true,
      configurable: true,
    });
  });

  // Attach getters
  if (definition.getters) {
    Object.entries(definition.getters).forEach(([key, fn]) => {
      const computedRef = computed(() => {
        return fn(store as StoreState<T>);
      });
      Object.defineProperty(store, key, {
        get: () => {
          return computedRef.value;
        },
        enumerable: true,
        configurable: true,
      });
    });
  }

  // Attach actions
  if (definition.actions) {
    const boundActions = {} as A;
    Object.entries(definition.actions).forEach(([key, fn]) => {
      // Bind the store as `this`
      boundActions[key as keyof A] = fn.bind(store) as A[keyof A];
    });
    // From the outside, they look like normal methods:
    (store as any).actions = boundActions;
  }

  return [() => useSnapshot(store), store];
}
