export type GettersReturn<G> = {
    [K in keyof G]: G[K] extends (...args: any[]) => infer R ? R : never;
};
export type State<T> = {
    [K in keyof T]-?: T[K];
};
export type StoreInstance<T, G = {}> = T & GettersReturn<G> & {
    $state: T;
};
export type Getters<T, G = {}> = {
    [K: string]: (store: StoreInstance<T, G>) => any;
};
export type Actions<T, G = {}> = {
    [K: string]: (this: StoreInstance<T, G>, ...args: any[]) => any;
};
export type StoreDefinition<T extends object, G extends Getters<T, G> = {}, A extends Actions<T, G> = {}> = {
    state(): T;
    getters?: G;
    actions?: A;
};
export type Store<T extends object, G extends Getters<T, G> = {}, A extends Actions<T, G> = {}> = StoreInstance<T, G> & {
    actions: A;
    $underive(keys: (keyof GettersReturn<G>)[]): void;
    $invalidate(keys: (keyof GettersReturn<G>)[]): void;
};
export declare function defineStore<T extends object, G extends Getters<T, G> = {}, A extends Actions<T, G> = {}>(definition: StoreDefinition<T, G, A>): Store<T, G, A>;
