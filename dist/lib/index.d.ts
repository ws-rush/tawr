import { ReactNode } from 'react';
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
type GetterReturnTypes<G> = {
    [K in keyof G]: G[K] extends (get: any) => infer R ? R : never;
};
type StoreState<S, G> = S & GetterReturnTypes<G>;
type Actions<S, G> = {
    [K: string]: (this: StoreState<S, G>, ...args: any[]) => any;
};
type StoreDefinition<S extends object, G extends Getters, A extends Actions<S, G>> = {
    state: () => S;
    getters?: (state: S) => G;
    actions?: A;
};
type StoreType<S, G, A> = StoreState<S, G> & {
    actions: {
        [K in keyof A]: A[K] extends (this: any, ...args: infer P) => infer R ? (...args: P) => R : never;
    };
    $underive: (keys: (keyof G)[]) => void;
    $invalidate: (keys: (keyof G)[]) => void;
    $onAction: (subscriber: ActionSubscriber) => () => void;
};
declare function defineStore<S extends object, G extends Getters, A extends Actions<S, G>>(storeDefinition: StoreDefinition<S, G, A>): StoreType<S, G, A>;
declare const useSnapshot: <T extends object>(proxyObject: T) => DeepWritable<T>;
interface AwaitableProps<T> {
    resolve: Promise<T>;
    fallback?: ReactNode;
    error?: (error: Error) => ReactNode;
    children: (value: T) => ReactNode;
}
declare function Awaitable<T>({ resolve, fallback, error, children }: AwaitableProps<T>): import("react/jsx-runtime").JSX.Element;
export { defineStore, useSnapshot, Awaitable };
