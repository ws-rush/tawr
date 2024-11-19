type Getters<T> = Record<string, (state: T) => any>;
type Actions = Record<string, (...args: any[]) => any>;
type GettersReturn<G extends Getters<any>> = {
    [K in keyof G]: ReturnType<G[K]>;
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
export declare function defineStore<T extends object, G extends Getters<T>, A extends Actions>(definition: StoreDefinition<T, G, A>): Store<T, G, A>;
export {};
