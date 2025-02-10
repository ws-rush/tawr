import { Actions, Getters, Queries, Store } from './store';
export declare function useSnapshot<T extends object, G extends Getters<T>, Q extends Queries<T>, A extends Actions<T, G, Q>>(store: Store<T, G, Q, A>): Store<T, G, Q, A>;
