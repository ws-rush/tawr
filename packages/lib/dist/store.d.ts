export type GettersReturn<G> = {
    [K in keyof G]: G[K] extends (state: any) => infer R ? R : never;
};
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
    [K: string]: (this: StoreStateType<T, G, Q> & SpecialActions<G, Q>, ...args: any[]) => any;
};
/**
 * The final store type.
 * In addition to raw state, getters and query states,
 * each action is “unwrapped” so that it appears as a normal method.
 */
export type Store<T, G, Q, A extends Actions<T, G, Q>> = StoreStateType<T, G, Q> & {
    [K in keyof A]: A[K] extends (this: any, ...args: infer P) => infer R ? (...args: P) => R : never;
} & SpecialActions<G, Q>;
export type QueryFunction<T> = () => Promise<T>;
export type QueryDefinition<T> = {
    fn: QueryFunction<T>;
};
export type Query<T> = QueryDefinition<T>;
export type QueryState<T> = {
    value: T | undefined;
    isLoading: boolean;
    isFetching: boolean;
    error: Error | null;
};
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
export type StoreDefinition<T extends object, G extends Record<string, (state: StoreStateType<T, G, Q>) => any> = {}, Q extends Record<string, (state: StoreStateType<T, G, Q>) => Query<any>> = {}, A extends Actions<T, G, Q> = {}> = {
    state?(): T;
    getters?: G;
    queries?: Q;
    actions?: A;
};
export declare function defineStore<T extends object, G extends Record<string, (state: StoreStateType<T, G, Q>) => any>, Q extends Record<string, (state: StoreStateType<T, G, Q>) => Query<any>>, A extends Actions<T, G, Q>>(definition: StoreDefinition<T, G, Q, A>): Store<T, G, Q, A>;
