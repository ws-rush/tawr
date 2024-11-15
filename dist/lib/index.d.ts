type ActionSubscriber = (context: ActionContext) => void;
type ActionContext = {
    name: string;
    store: any;
    args: any[];
    after: (callback: (result: any) => void) => void;
    onError: (callback: (error: any) => void) => void;
};
type DeepWritable<T> = {
    -readonly [P in keyof T]: DeepWritable<T[P]>;
};
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
type StoreType<S, G, A> = S & GetterReturnTypes<G> & {
    actions: A;
    $underive: (keys: (keyof G)[]) => void;
    $invalidate: (keys: (keyof G)[]) => void;
    $onAction: (subscriber: ActionSubscriber) => () => void;
};
declare function defineStore<S extends object, G extends Getters, A extends Actions>(storeDefinition: StoreDefinition<S, G, A>): StoreType<S, G, A>;
declare const useSnapshot: <T extends object>(proxyObject: T) => DeepWritable<T>;
export { defineStore, useSnapshot };
