import { useSnapshot } from 'valtio';
type Get = <T extends object>(proxyObject: T) => T;
type Getters<T> = (state: T) => {
    [K: string]: (get: Get) => any;
};
type Actions<T> = ThisType<T> & Record<string, (this: T, ...args: any[]) => any>;
type Plugin<T extends object> = (context: {
    store: T;
    options: StoreDefinition<T>;
}) => void | {
    [key: string]: any;
};
type StoreDefinition<T extends object, G extends Getters<T> = Getters<T>, A extends Actions<T> = {}> = {
    state: () => T | Promise<T>;
    getters?: G;
    actions?: A;
};
type GetterFunctions<T extends object, G extends Getters<T>> = G extends (state: T) => infer R ? R : never;
type ExtractGetterReturnTypes<GObj> = {
    [K in keyof GObj]: GObj[K] extends (get: any) => infer R ? R : never;
};
type GetterReturnTypes<T extends object, G extends Getters<T>> = ExtractGetterReturnTypes<GetterFunctions<T, G>>;
type GetterKeys<G extends Getters<any>> = keyof ReturnType<G>;
export interface GettersControl<G extends Getters<any>> {
    $underive(keys: Array<GetterKeys<G>>): void;
    $invalidate(keys: Array<GetterKeys<G>>): void;
}
type StoreType<T extends object, G extends Getters<T>, A extends Actions<T>> = T & GetterReturnTypes<T, G> & A & GettersControl<G>;
declare const tawr: {
    use: <T extends object>(plugin: Plugin<T>) => void;
};
declare function defineStore<T extends object, G extends Getters<T>, A extends Actions<T>>(storeDefinition: StoreDefinition<T, G, A>): Promise<StoreType<T, G, A>>;
export { tawr, defineStore, useSnapshot };
