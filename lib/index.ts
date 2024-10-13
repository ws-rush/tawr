import { proxy, useSnapshot } from 'valtio';
import { derive } from 'derive-valtio';

type Get = <T extends object>(proxyObject: T) => T;

type Getters<T> = (state: T) => { [K: string]: (get: Get) => any };
type Actions<T> = ThisType<T> & Record<string, (this: T, ...args: any[]) => any>;

type Plugin<T extends object> = (context: {
  store: T;
  options: StoreDefinition<T>;
}) => void | { [key: string]: any };

type StoreDefinition<
  T extends object,
  G extends Getters<T> = Getters<T>,
  A extends Actions<T> = {}
> = {
  state: () => T;
  getters?: G;
  actions?: A;
};

type GetterFunctions<T extends object, G extends Getters<T>> = G extends (state: T) => infer R
  ? R
  : never;

type ExtractGetterReturnTypes<GObj> = {
  [K in keyof GObj]: GObj[K] extends (get: any) => infer R ? R : never;
};

type GetterReturnTypes<T extends object, G extends Getters<T>> = ExtractGetterReturnTypes<
  GetterFunctions<T, G>
>;

type StoreType<T extends object, G extends Getters<T>, A extends Actions<T>> = T &
  GetterReturnTypes<T, G> &
  A;

const plugins: Plugin<any>[] = [];

const tawr = {
  use: <T extends object>(plugin: Plugin<T>) => {
    plugins.push(plugin);
  },
};

function defineStore<
  T extends object,
  G extends Getters<T>,
  A extends Actions<T>
>(storeDefinition: StoreDefinition<T, G, A>): StoreType<T, G, A> {
  const { state: stateFunc, getters, actions } = storeDefinition;

  // Initialize state
  const proxyState = proxy<T>(stateFunc());
  const state = proxyState as StoreType<T, G, A>;

  // Getters
  if (getters) {
    derive(getters(state), {
      proxy: state,
    });
  }

  // Add actions
  if (actions) {
    Object.assign(state, actions);
  }

  // Return state with inferred getters
  return state;
}

export { tawr, defineStore, useSnapshot };