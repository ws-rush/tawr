export type GettersReturn<G> = {
    [K in keyof G]: G[K] extends (...args: any[]) => infer R ? R : never;
};
export type State<T> = {
    [K in keyof T]-?: T[K];
};
export type StoreState<T> = {
    [K in keyof T]: T[K];
} & {
    $state: T;
};
export type Getters<T> = {
    [K: string]: (store: StoreState<T>) => any;
};
export type Actions<T, G> = {
    [K: string]: (this: StoreState<T> & GettersReturn<G>, ...args: any[]) => any;
};
export type StoreDefinition<T extends object, G extends Getters<T> = Getters<T>, A extends Actions<T, G> = Actions<T, G>> = {
    state(): T;
    getters?: G;
    actions?: A;
};
export type Store<T extends object, G extends Getters<T> = Getters<T>, A extends Actions<T, G> = Actions<T, G>> = StoreState<T> & GettersReturn<G> & {
    actions: A;
    $underive(keys: (keyof GettersReturn<G>)[]): void;
    $invalidate(keys: (keyof GettersReturn<G>)[]): void;
};
export declare function defineStore<T extends object, G extends Getters<T> = Getters<T>, A extends Actions<T, G> = Actions<T, G>>(definition: StoreDefinition<T, G, A>): Store<T, G, A>;
