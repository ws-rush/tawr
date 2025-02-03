import { reactive,  effect, stop } from "@vue/reactivity";
import { useSnapshot } from "./use-snapshot";

// 1) The store shape that each action will see as `this`.
type StoreContext<T, G> = T & GettersReturn<G> & {
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

export type StoreState<T> = T;

export type Getters<T> = {
  [K: string]: (store: T & { [K in keyof Getters<T>]: ReturnType<Getters<T>[K]> }) => any;
};

type SpecialActions<G> = 
  {
    $underive(keys: (keyof GettersReturn<G>)[]): void;
    $invalidate(keys: (keyof GettersReturn<G>)[]): void;
  }

// 3) For the final store, from “external usage,” actions
//    become methods that do not expose a `this` parameter.
export type Store<
  T extends object,
  G extends Getters<T>,
  A extends Actions<T, G>
> = T & GettersReturn<G> & {
    [K in keyof A]: A[K] extends (this: any, ...args: infer P) => infer R
      ? (...args: P) => R
      : never;
  } & SpecialActions<G>;

export type StoreDefinition<
  T extends object,
  G extends Getters<T> = Getters<T>,
  A extends Actions<T, G> = Actions<T, G>
> = {
  state?(): T;
  getters?: G;
  actions?: A;
};

const effects = new Map()

// 4) Implementation mostly unchanged—only subtle type tweaks:
export function defineStore<
  T extends object,
  G extends Getters<T> = Getters<T>,
  A extends Actions<T, G> = Actions<T, G>
>(
  definition: StoreDefinition<T, G, A>
): [() => Store<T, G, A>, Store<T, G, A>] {
  const initialState = definition.state?.() ?? {};
  const store = reactive(initialState) as Store<T, G, A>;

  // Attach actions
    const allActions = { 
    ...definition.actions, 
    $underive(keys: (keyof GettersReturn<G>)[]) {
      keys.forEach((key) => {
        if (effects.get(key)) stop(effects.get(key))
        effects.delete(key)
      })
    },
    $invalidate(keys: (keyof GettersReturn<G>)[]) {
      keys.forEach((key) => {
        if(effects.get(key)) stop(effects.get(key))
        const eff = effect(() => {
          store[key] = definition.getters?.[key](store);
        })
        effects.set(key, eff)
      })
    }
    }  as Record<keyof A | "$underive" | "$invalidate", Function> & SpecialActions<G>;
    for (const key in allActions) {
      store[key as keyof Store<T, G, A>] = allActions[key].bind(store)
    }

  // Attach getters
  if (definition.getters) {
    // const effects = new Map()
    for (const key in definition.getters) {
      const eff = effect(() => {
        store[key] = definition.getters?.[key](store);
      })
      effects.set(key, eff)
    }
  }

  return [() => useSnapshot(store), store];
}
