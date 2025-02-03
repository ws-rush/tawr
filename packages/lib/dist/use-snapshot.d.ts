import { Actions, Getters, Store } from './store';
export declare function useSnapshot<T extends object, G extends Getters<T>, A extends Actions<T, G>>(store: Store<T, G, A>): Store<T, G, A>;
