type StoreGetters<G> = {
    [K in keyof G]: G[K] extends (state: any) => any ? ReturnType<G[K]> : never;
};
type StoreState<T> = {
    [K in keyof T]: T[K];
};
type StoreActions<A> = {
    [K in keyof A]: A[K];
};
type Store<T extends object, G extends Record<string, (state: T) => any>, A extends Record<string, (...args: any[]) => any>> = StoreState<T> & StoreGetters<G> & {
    $state: T;
    actions: StoreActions<A>;
};
type StoreSnapshot<T extends object, G extends Record<string, (state: T) => any>> = StoreState<T> & StoreGetters<G> & {
    $state: T;
};
export declare function useSnapshot<T extends object, G extends Record<string, (state: T) => any>, A extends Record<string, (...args: any[]) => any>>(store: Store<T, G, A>): StoreSnapshot<T, G>;
export {};
