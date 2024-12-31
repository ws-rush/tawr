export type Getters<T> = Record<string, (store: T & GettersReturn<Getters<T>>) => any>;
export type Actions = Record<string, (...args: any[]) => any>;
export type GettersReturn<G> = {
    [K in keyof G]: G[K] extends (...args: any[]) => infer R ? R : never;
};
export type State<T> = {
    [K in keyof T]-?: T[K];
};
export type StoreDefinition<T extends object, G extends Getters<T>, A extends Actions> = {
    state(): T;
    getters?: G;
    actions?: A;
};
export type Store<T extends object, G extends Getters<T>, A extends Actions> = State<T> & GettersReturn<G> & {
    $state: T;
    actions: A;
    $underive(keys: (keyof GettersReturn<G>)[]): void;
    $invalidate(keys: (keyof GettersReturn<G>)[]): void;
};
export declare function defineStore<T extends object, G extends Getters<T> = {}, A extends Actions = {}>(definition: StoreDefinition<T, G, A>): Store<T, G, A>;
