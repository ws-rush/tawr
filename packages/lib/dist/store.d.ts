type StoreContext<T, G> = T & GettersReturn<G> & {
    $underive(keys: (keyof GettersReturn<G>)[]): void;
    $invalidate(keys: (keyof GettersReturn<G>)[]): void;
};
export type Actions<T extends object, G extends Getters<T>> = {
    [K: string]: (this: StoreContext<T, G>, ...args: any[]) => any;
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
type SpecialActions<G> = {
    $underive(keys: (keyof GettersReturn<G>)[]): void;
    $invalidate(keys: (keyof GettersReturn<G>)[]): void;
};
export type Store<T extends object, G extends Getters<T>, A extends Actions<T, G>> = T & GettersReturn<G> & {
    [K in keyof A]: A[K] extends (this: any, ...args: infer P) => infer R ? (...args: P) => R : never;
} & SpecialActions<G>;
export type StoreDefinition<T extends object, G extends Getters<T> = Getters<T>, A extends Actions<T, G> = Actions<T, G>> = {
    state?(): T;
    getters?: G;
    actions?: A;
};
export declare function defineStore<T extends object, G extends Getters<T> = Getters<T>, A extends Actions<T, G> = Actions<T, G>>(definition: StoreDefinition<T, G, A>): [() => Store<T, G, A>, Store<T, G, A>];
export {};
