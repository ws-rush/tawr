import { Store as BaseStore, Getters, GettersReturn, Actions, State } from './store';
export type PathKey = string | number;
export type Path = PathKey[];
export type StoreSnapshot<T extends object, G extends Getters<T>> = State<T> & GettersReturn<G>;
export declare function useSnapshot<T extends object, G extends Getters<T>, A extends Actions>(store: BaseStore<T, G, A>): StoreSnapshot<T, G>;
