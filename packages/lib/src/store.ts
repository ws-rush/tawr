import { reactive,  effect, stop } from "@vue/reactivity";

// Helper type to get keys from both getters and queries
type StoreKeys<G, Q> = keyof (GettersReturn<G> & QueriesReturn<Q>);

// 1) The store shape that each action will see as `this`.
type StoreContext<T, G, Q> = T & GettersReturn<G> & QueriesReturn<Q> & {
    $underive(keys: StoreKeys<G, Q>[]): void;
    $invalidate(keys: StoreKeys<G, Q>[]): void;
  };

// 2) Actions now require their `this` to be that StoreContext.
export type Actions<T extends object, G extends Getters<T>, Q extends Queries<T>> = {
  [K: string]: (this: StoreContext<T, G, Q>, ...args: any[]) => any;
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

type SpecialActions<G, Q> = 
  {
    $underive(keys: StoreKeys<G, Q>[]): void;
    $invalidate(keys: StoreKeys<G, Q>[]): void;
  }

// 3) For the final store, from "external usage," actions
//    become methods that do not expose a `this` parameter.
export type Store<
  T extends object,
  G extends Getters<T>,
  A extends Actions<T, G, Q>,
  Q extends Queries<T>
> = T & GettersReturn<G> & QueriesReturn<Q> & {
    [K in keyof A]: A[K] extends (this: any, ...args: infer P) => infer R
      ? (...args: P) => R
      : never;
  } & SpecialActions<G, Q>;

export type QueryFunction = () => Promise<any>;

export type QueryDefinition = {
  fn: QueryFunction;
};

export type Query = QueryDefinition;

export type Queries<T> = {
  [key: string]: (store: T) => Query;
};

export type QueryState = {
  value: any;
  isLoading: boolean;
  isFetching: boolean;
  error: null | any;
};

export type QueriesReturn<Q> = {
  [K in keyof Q]: QueryState;
};

export type StoreDefinition<
  T extends object,
  G extends Getters<T> = Getters<T>,
  Q extends Queries<T> = Queries<T>,
  A extends Actions<T, G, Q> = Actions<T, G, Q>
> = {
  state?(): T;
  getters?: G;
  actions?: A;
  queries?: Q;
};

const effects = new Map()

// Helper to check if key exists in object
function hasKey<T extends object>(obj: T | undefined, key: PropertyKey): key is keyof T {
  return obj !== undefined && key in obj;
}

// 4) Implementation mostly unchanged—only subtle type tweaks:
export function defineStore<
  T extends object,
  G extends Getters<T> = Getters<T>,
  Q extends Queries<T> = Queries<T>,
  A extends Actions<T, G, Q> = Actions<T, G, Q>
>(
  definition: StoreDefinition<T, G, Q, A>
): Store<T, G, A, Q> {
  const initialState = definition.state?.() ?? {};
  const store = reactive(initialState) as Store<T, G, A, Q>;

  // Attach actions
    const allActions = { 
    ...definition.actions, 
    $underive(keys: StoreKeys<G, Q>[]) {
      keys.forEach((key) => {
        if (effects.get(key)) stop(effects.get(key))
        effects.delete(key)
      })
    },
    $invalidate(keys: StoreKeys<G, Q>[]) {
      keys.forEach((key) => {
        if(effects.get(key)) stop(effects.get(key))
        const eff = effect(() => {
          const getters = definition.getters
          const queries = definition.queries
          
          if (getters && hasKey(getters, key)) {
            store[key] = getters[key](store);
          } else if (queries && hasKey(queries, key)) {
            const query = queries[key](store);
            if (query) {
              const queryState = store[key] as QueryState;
              queryState.isFetching = true;
              query.fn()
                .then((value: any) => queryState.value = value)
                .catch((error: any) => queryState.error = error)
                .finally(() => {
                  queryState.isFetching = false;
                });
            }
          }
        })
        effects.set(key, eff)
      })
    }
    }  as Record<keyof A | "$underive" | "$invalidate", Function> & SpecialActions<G, Q>;
    for (const key in allActions) {
      store[key as keyof Store<T, G, A, Q>] = allActions[key].bind(store)
    }

  // Attach getters
  if (definition.getters) {
    for (const key in definition.getters) {
      const eff = effect(() => {
        store[key] = definition.getters![key](store);
      })
      effects.set(key, eff)
    }
  }

  // Attach Queries
  if (definition.queries) {
    for (const key in definition.queries) {
      (store as any)[key] = {
        value: undefined,
        isLoading: false,
        isFetching: false,
        error: null
      }

      const execute = async () => {
        const queryState = store[key] as QueryState;
        queryState.isFetching = true;
        queryState.isLoading = true;
        const query = definition.queries![key](store)
        if (!query) {
          queryState.error = new Error('Query not found')
          queryState.isFetching = false
          queryState.isLoading = false
          return
        }
        
        query.fn()
          .then((value: any) => queryState.value = value)
          .catch((error: any) => queryState.error = error)
          .finally(() => {
            queryState.isFetching = false;
            queryState.isLoading = false;
          })
        }

      const eff = effect(execute);
      effects.set(key, eff)

      // track isLoading with effect
      // effect(() => {
      //   store[key].isLoading = store[key].isFetching && store[key].value === undefined;
      // });
    }
  }

  return store;
}
