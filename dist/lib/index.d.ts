import { useSnapshot } from 'valtio';
type Get = <T extends object>(proxyObject: T) => T;
type Getters = {
    [K: string]: (get: Get) => any;
};
type Actions = Record<string, (...args: any[]) => any>;
type GetterReturnTypes<G> = {
    [K in keyof G]: G[K] extends (get: any) => infer R ? R : never;
};
type ThisForActions<S, G, A> = S & GetterReturnTypes<G> & A;
type StoreDefinition<S, G extends Getters, A> = {
    state: () => S;
    getters?: (state: S) => G;
    actions?: A & ThisType<ThisForActions<S, G, A>>;
};
type StoreType<S, G, A> = S & GetterReturnTypes<G> & A;
declare function defineStore<S extends object, G extends Getters, A extends Actions>(storeDefinition: StoreDefinition<S, G, A>): StoreType<S, G, A>;
export { defineStore, useSnapshot };
