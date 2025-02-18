export type GettersReturn<G> = {
    [K in keyof G]: G[K] extends (state: any) => infer R ? R : never;
};
export type QueriesReturn<Q> = {
    [K in keyof Q]: Q[K] extends (state: any) => Query<infer T> ? QueryState<T> : never;
};
export type StoreStateType<T, G, Q> = T & GettersReturn<G> & QueriesReturn<Q>;
export type SpecialActions<G, Q> = {
    $underive(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]): void;
    $invalidate(keys: (keyof (GettersReturn<G> & QueriesReturn<Q>))[]): void;
};
export type Actions<T, G, Q> = {
    [K: string]: (this: StoreStateType<T, G, Q> & SpecialActions<G, Q>, ...args: any[]) => any;
};
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
export type StoreDefinition<T extends object, G extends Record<string, (state: StoreStateType<T, G, Q>) => any> = {}, Q extends Record<string, (state: StoreStateType<T, G, Q>) => Query<any>> = {}, A extends Actions<T, G, Q> = {}> = {
    state?(): T;
    getters?: G;
    queries?: Q;
    actions?: A;
};
/**
 * defineStore creates a reactive store with lazy getters and lazy queries.
 *
 * - Getters are wrapped in computed() so they are only evaluated on access.
 * - Queries are defined as lazy properties that initialize their effect on first access.
 * - Calling $invalidate or $underive on a query key stops its effect and resets its state,
 *   so that the next access reinitializes and re‑runs the query.
 */
export declare function defineStore<T extends object, G extends Record<string, (state: StoreStateType<T, G, Q>) => any>, Q extends Record<string, (state: StoreStateType<T, G, Q>) => Query<any>>, A extends Actions<T, G, Q>>(definition: StoreDefinition<T, G, Q, A>): Store<T, G, Q, A>;
