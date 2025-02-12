type StoreKeys<G, Q> = keyof (GettersReturn<G> & QueriesReturn<Q>);
type StoreContext<T, G, Q> = T & GettersReturn<G> & QueriesReturn<Q> & {
    $underive(keys: StoreKeys<G, Q>[]): void;
    $invalidate(keys: StoreKeys<G, Q>[]): void;
};
export type Actions<T extends object, G extends Getters<T>, Q extends Queries<T>> = {
    [K: string]: (this: StoreContext<T, G, Q>, ...args: any[]) => any;
};
export type GettersReturn<G> = {
    [K in keyof G]: G[K] extends (...args: any[]) => infer R ? R : never;
};
export type State<T> = {
    [K in keyof T]-?: T[K];
};
export type StoreState<T> = T;
export type Getters<T> = {
    [K: string]: (store: T & {
        [K in keyof Getters<T>]: ReturnType<Getters<T>[K]>;
    }) => any;
};
type SpecialActions<G, Q> = {
    $underive(keys: StoreKeys<G, Q>[]): void;
    $invalidate(keys: StoreKeys<G, Q>[]): void;
};
export type Store<T extends object, G extends Getters<T>, A extends Actions<T, G, Q>, Q extends Queries<T>> = T & GettersReturn<G> & QueriesReturn<Q> & {
    [K in keyof A]: A[K] extends (this: any, ...args: infer P) => infer R ? (...args: P) => R : never;
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
export type StoreDefinition<T extends object, G extends Getters<T> = Getters<T>, Q extends Queries<T> = Queries<T>, A extends Actions<T, G, Q> = Actions<T, G, Q>> = {
    state?(): T;
    getters?: G;
    actions?: A;
    queries?: Q;
};
export declare function defineStore<T extends object, G extends Getters<T> = Getters<T>, Q extends Queries<T> = Queries<T>, A extends Actions<T, G, Q> = Actions<T, G, Q>>(definition: StoreDefinition<T, G, Q, A>): Store<T, G, A, Q>;
export {};
