import { reactive, effect, stop } from "@vue/reactivity";

/* ─── HELPER TYPES ────────────────────────────────────────────── */

// The computed return types for a getters map.
export type GettersReturn<G> = {
  [K in keyof G]: G[K] extends (state: any) => infer R ? R : never;
};

// The computed “query state” types for a queries map.
export type QueriesReturn<Q> = {
  [K in keyof Q]: Q[K] extends (state: any) => Query<infer T> ? QueryState<T> : never;
};

/**
 * The full store state (used inside getters, queries, and actions)
 * consists of:
 *  - the raw state,
 *  - computed getters,
 *  - reactive query states.
 */
export type StoreStateType<T, G, Q> = T & GettersReturn<G> & QueriesReturn<Q>;

/**
 * The two “special” methods available on the store.
 * (The keys here are derived from the union of getter and query keys.)
 */
export type SpecialActions<G, Q> = {
  $underive(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]): void;
  $invalidate(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]): void;
};

/**
 * Actions get `this` as the complete store (state, getters, queries)
 * plus the two special methods.
 */
export type Actions<T, G, Q> = {
  [K: string]: (
    this: StoreStateType<T, G, Q> & SpecialActions<G, Q>,
    ...args: any[]
  ) => any;
};

/**
 * The final store type.
 * In addition to raw state, getters and query states,
 * each action is “unwrapped” so that it appears as a normal method.
 */
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

// A query’s function returns a promise.
export type QueryFunction<T> = () => Promise<T>;

// A query is defined by its function.
export type QueryDefinition<T> = { fn: QueryFunction<T> };
export type Query<T> = QueryDefinition<T>;

// The reactive “query state” that will appear on the store.
export type QueryState<T> = {
  value: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
};

/* ─── STORE DEFINITION ────────────────────────────────────────── */

/**
 * The store definition accepts:
 *  - a raw state creator,
 *  - a set of getters (each receiving the full store state),
 *  - a set of queries (each receiving the full store state and returning a Query),
 *  - a set of actions.
 *
 * The generics enforce that:
 *  - `G` extends a map of functions taking a StoreStateType,
 *  - `Q` extends a map of functions taking a StoreStateType and returning a Query,
 *  - `A` extends Actions using those types.
 */
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

const effects = new Map<string, ReturnType<typeof effect>>();

// Helper: check if an object has a given key.
function hasKey<T extends object>(
  obj: T | undefined,
  key: PropertyKey
): key is keyof T {
  return obj !== undefined && key in obj;
}

export function defineStore<
  T extends object,
  G extends Record<string, (state: StoreStateType<T, G, Q>) => any>,
  Q extends Record<string, (state: StoreStateType<T, G, Q>) => Query<any>>,
  A extends Actions<T, G, Q>
>(definition: StoreDefinition<T, G, Q, A>): Store<T, G, Q, A> {
  const initialState = definition.state ? definition.state() : ({} as T);
  // Create a reactive store seeded with the raw state.
  const store = reactive(initialState) as unknown as Store<T, G, Q, A>;

  // ─── Attach Actions (including the two special methods) ───────

  const allActions: Record<string, Function> & SpecialActions<G, Q> = {
    ...(definition.actions || {}),
    $underive(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]) {
      keys.forEach((key) => {
        const eff = effects.get(String(key));
        if (eff) stop(eff);
        effects.delete(String(key));
      });
    },
    $invalidate(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]) {
      keys.forEach((key) => {
        const eff = effects.get(String(key));
        if (eff) stop(eff);
        // Create a new effect to re-run the getter or query.
        const newEff = effect(() => {
          if (definition.getters && hasKey(definition.getters, key)) {
            const getterFn = definition.getters[key] as (
              state: StoreStateType<T, G, Q>
            ) => any;
            store[key as keyof Store<T, G, Q, A>] = getterFn(store);
          } else if (definition.queries && hasKey(definition.queries, key)) {
            const query = definition.queries[key](store);
            if (query) {
              const queryState = store[
                key as keyof Store<T, G, Q, A>
              ] as unknown as QueryState<any>;
              queryState.isFetching = true;
              query
                .fn()
                .then((value: any) => {
                  queryState.value = value;
                  queryState.error = null;
                })
                .catch((error: Error) => {
                  queryState.error = error;
                })
                .finally(() => {
                  queryState.isFetching = false;
                });
            }
          }
        });
        effects.set(String(key), newEff);
      });
    }
  };

  // Bind each action so that its `this` is the store.
  for (const key in allActions) {
    store[key as keyof Store<T, G, Q, A>] = allActions[key].bind(store);
  }

  // ─── Attach Queries ────────────────────────────────────────────

  if (definition.queries) {
    for (const key in definition.queries) {
      // Create a reactive query state.
      const queryState = reactive<QueryState<any>>({
        value: undefined,
        isLoading: false,
        isFetching: false,
        error: null
      });
      (store as any)[key] = queryState;

      const execute = async () => {
        queryState.isFetching = true;
        const query = definition.queries![key](store);
        if (!query) {
          queryState.error = new Error("Query not found");
          queryState.isFetching = false;
          return;
        }
        try {
          const value = await query.fn();
          queryState.value = value;
          queryState.error = null;
        } catch (error) {
          queryState.error =
            error instanceof Error ? error : new Error(String(error));
        } finally {
          queryState.isFetching = false;
        }
      };

      const eff = effect(execute);
      effects.set(key, eff);

      // Also update `isLoading` based on whether the query is still fetching and has no value.
      effect(() => {
        queryState.isLoading =
          queryState.isFetching && queryState.value === undefined;
      });
    }
  }

  // ─── Attach Getters ────────────────────────────────────────────

  if (definition.getters) {
    for (const key in definition.getters) {
      const getterFn = definition.getters[key] as (
        state: StoreStateType<T, G, Q>
      ) => any;
      const eff = effect(() => {
        store[key as keyof Store<T, G, Q, A>] = getterFn(store);
      });
      effects.set(key, eff);
    }
  }

  return store;
}
