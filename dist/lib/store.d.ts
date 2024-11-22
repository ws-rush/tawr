type Getters<T> = Record<string, (store: T & GettersReturn<Getters<T>>) => any>;
type Actions = Record<string, (...args: any[]) => any>;
type GettersReturn<G> = {
    [K in keyof G]: G[K] extends (...args: any[]) => any ? ReturnType<G[K]> : never;
};
type State<T> = {
    [K in keyof T]: T[K];
};
type StoreDefinition<T extends object, G extends Getters<T>, A extends Actions> = {
    state(): T;
    getters?: G;
    actions?: A;
};
type Store<T extends object, G extends Getters<T>, A extends Actions> = State<T> & GettersReturn<G> & {
    $state: T;
    actions: A;
};
export declare function defineStore<T extends object, G extends Getters<T> = {}, A extends Actions = {}>(definition: StoreDefinition<T, G, A>): Store<T, G, A>;
export {};
