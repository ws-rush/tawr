import { reactive, effect, stop, computed } from "@vue/reactivity";

/* ─── HELPER TYPES ────────────────────────────────────────────── */

export type GettersReturn<G> = {
  [K in keyof G]: G[K] extends (state: any) => infer R ? R : never;
};

export type QueriesReturn<Q> = {
  [K in keyof Q]: Q[K] extends (state: any) => Query<infer T>
    ? QueryState<T>
    : never;
};

export type StoreStateType<T, G, Q> = T & GettersReturn<G> & QueriesReturn<Q>;

export type SpecialActions<G, Q> = {
  $underive(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]): void;
  $invalidate(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]): void;
};

export type Actions<T, G, Q> = {
  [K: string]: (
    this: StoreStateType<T, G, Q> & SpecialActions<G, Q>,
    ...args: any[]
  ) => any;
};

export type Store<T, G, Q, A extends Actions<T, G, Q>> =
  StoreStateType<T, G, Q> & {
    [K in keyof A]: A[K] extends (
      this: any,
      ...args: infer P
    ) => infer R
      ? (...args: P) => R
      : never;
  } & SpecialActions<G, Q>;

/* ─── QUERY TYPES ─────────────────────────────────────────────── */

export type QueryFunction<T> = () => Promise<T>;

export type QueryDefinition<T> = { fn: QueryFunction<T> };
export type Query<T> = QueryDefinition<T>;

export type QueryState<T> = {
  value: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
};

/* ─── STORE DEFINITION ────────────────────────────────────────── */

export type StoreDefinition<
  T extends object,
  G extends Record<string, (state: StoreStateType<T, G, Q>) => any> = {},
  Q extends Record<string, (state: StoreStateType<T, G, Q>) => Query<any>> = {},
  A extends Actions<T, G, Q> = {}
> = {
  state?(): T;
  getters?: G;
  queries?: Q;
  actions?: A;
};

/* ─── IMPLEMENTATION ───────────────────────────────────────────── */

// Global effects map for non‑lazy getters (if needed)
const effects = new Map<string, ReturnType<typeof effect>>();

/**
 * For lazy queries we keep per‑query data in this map.
 * Each entry stores:
 *  - whether the query’s effect has been initialized,
 *  - the effect reference (if any),
 *  - and the reactive query state.
 */
type LazyData = {
  initialized: boolean;
  queryEff: ReturnType<typeof effect> | null;
  queryState: QueryState<any>;
};
const lazyQueryData = new Map<string, LazyData>();

/**
 * defineStore creates a reactive store with lazy getters and lazy queries.
 * 
 * - Getters are wrapped in computed() so they are only evaluated on access.
 * - Queries are defined as lazy properties that initialize their effect on first access.
 * - Calling $invalidate or $underive on a query key stops its effect and resets its state,
 *   so that the next access reinitializes and re‑runs the query.
 */
export function defineStore<
  T extends object,
  G extends Record<string, (state: StoreStateType<T, G, Q>) => any>,
  Q extends Record<string, (state: StoreStateType<T, G, Q>) => Query<any>>,
  A extends Actions<T, G, Q>
>(definition: StoreDefinition<T, G, Q, A>): Store<T, G, Q, A> {
  const initialState = definition.state ? definition.state() : ({} as T);
  // First cast to unknown then to Store.
  const store = reactive(initialState) as unknown as Store<T, G, Q, A>;

  // ─── Attach Special Actions & User Actions ───────────────
  const allActions: Record<string, Function> & SpecialActions<G, Q> = {
    ...(definition.actions || {}),

    $underive(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]) {
      keys.forEach((key) => {
        const keyStr = String(key);
        if (lazyQueryData.has(keyStr)) {
          const data = lazyQueryData.get(keyStr)!;
          if (data.queryEff) {
            stop(data.queryEff);
            data.queryEff = null;
          }
          data.initialized = false;
          // Reset the query state
          data.queryState.value = undefined;
          data.queryState.error = null;
          data.queryState.isFetching = false;
          data.queryState.isLoading = false;
          effects.delete(keyStr);
        } else {
          const eff = effects.get(keyStr);
          if (eff) {
            stop(eff);
            effects.delete(keyStr);
          }
        }
      });
    },

    $invalidate(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]) {
      keys.forEach((key) => {
        const keyStr = String(key);
        if (lazyQueryData.has(keyStr)) {
          const data = lazyQueryData.get(keyStr)!;
          if (data.queryEff) {
            stop(data.queryEff);
            data.queryEff = null;
          }
          data.initialized = false;
          // Reset the query state
          data.queryState.value = undefined;
          data.queryState.error = null;
          data.queryState.isFetching = false;
          data.queryState.isLoading = false;
          effects.delete(keyStr);
        } else {
          const eff = effects.get(keyStr);
          if (eff) {
            stop(eff);
            effects.delete(keyStr);
          }
        }
      });
    }
  };

  // Bind each action to the store.
  for (const key in allActions) {
    store[key as keyof Store<T, G, Q, A>] = allActions[key].bind(store);
  }

  // ─── Attach Lazy Getters (using computed) ───────────────
  if (definition.getters) {
    for (const key in definition.getters) {
      const getterFn = definition.getters[key];
      const comp = computed(() => getterFn(store));
      Object.defineProperty(store, key, {
        enumerable: true,
        configurable: true,
        get() {
          return comp.value;
        }
      });
      // Optionally, if you wish to have a handle on the computed effect, you can store it in effects.
      // effects.set(String(key), (comp as any)._effect);
    }
  }

  // ─── Attach Lazy Queries ─────────────────────────────────
  if (definition.queries) {
    for (const key in definition.queries) {
      const keyStr = key;
      // Create lazy container data for this query.
      const lazyData: LazyData = {
        initialized: false,
        queryEff: null,
        queryState: reactive<QueryState<any>>({
          value: undefined,
          isLoading: false,
          isFetching: false,
          error: null
        })
      };
      lazyQueryData.set(keyStr, lazyData);

      Object.defineProperty(store, key, {
        enumerable: true,
        configurable: true,
        get() {
          if (!lazyData.initialized) {
            // Initialize the query effect on first access.
            lazyData.queryEff = effect(() => {
              lazyData.queryState.isFetching = true;
              const query = definition.queries![key](store);
              if (!query) {
                lazyData.queryState.error = new Error("Query not found");
                lazyData.queryState.isFetching = false;
                return;
              }
              query
                .fn()
                .then((value: any) => {
                  lazyData.queryState.value = value;
                  lazyData.queryState.error = null;
                })
                .catch((error: any) => {
                  lazyData.queryState.error =
                    error instanceof Error ? error : new Error(String(error));
                })
                .finally(() => {
                  lazyData.queryState.isFetching = false;
                });
            });
            effects.set(keyStr, lazyData.queryEff!);
            // Also track isLoading based on isFetching and whether a value exists.
            effect(() => {
              lazyData.queryState.isLoading =
                lazyData.queryState.isFetching &&
                lazyData.queryState.value === undefined;
            });
            lazyData.initialized = true;
          }
          return lazyData.queryState;
        }
      });
    }
  }

  return store;
}
