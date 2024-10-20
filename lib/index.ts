import { proxy, useSnapshot } from 'valtio';
import { watch } from 'valtio/utils';

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
  state: () => T | Promise<T>;
  getters?: G;
  actions?: A;
};

type GetterFunctions<T extends object, G extends Getters<T>> = G extends (
  state: T
) => infer R
  ? R
  : never;

type ExtractGetterReturnTypes<GObj> = {
  [K in keyof GObj]: GObj[K] extends (get: any) => infer R ? R : never;
};

type GetterReturnTypes<T extends object, G extends Getters<T>> =
  ExtractGetterReturnTypes<GetterFunctions<T, G>>;

type GetterKeys<G extends Getters<any>> = keyof ReturnType<G>;

export interface GettersControl<G extends Getters<any>> {
  $underive(keys: Array<GetterKeys<G>>): void;
  $invalidate(keys: Array<GetterKeys<G>>): void;
}

type StoreType<T extends object, G extends Getters<T>, A extends Actions<T>> = T &
  GetterReturnTypes<T, G> &
  A &
  GettersControl<G>;

const plugins: Plugin<any>[] = [];

const tawr = {
  use: <T extends object>(plugin: Plugin<T>) => {
    plugins.push(plugin);
  },
};

async function defineStore<T extends object, G extends Getters<T>, A extends Actions<T>>(
  storeDefinition: StoreDefinition<T, G, A>
): Promise<StoreType<T, G, A>> {
  const { state: stateFunc, getters, actions } = storeDefinition;

  // Initialize state
  const initialState = await stateFunc();
  const proxyState = proxy<T>(initialState);
  const state = proxyState as unknown as StoreType<T, G, A>;

  // Getters
  if (getters) {
    const getterFns = getters(state);
    type GetterKeys = keyof typeof getterFns;
    const disposers: Map<GetterKeys, () => void> = new Map();

    // For each getter, set up watch and store disposer
    for (const key in getterFns) {
      const getterFn = getterFns[key as GetterKeys];
      const disposer = watch((get) => {
        // Compute the value
        const value = getterFn(get);
        // Assign to state if changed
        if (state[key as keyof typeof state] !== value) {
          (state as any)[key] = value;
        }
      });
      disposers.set(key as GetterKeys, disposer);
    }

    // Add methods to state
    Object.assign(state, {
      $underive(keys: GetterKeys[]) {
        for (const key of keys) {
          if (disposers.has(key)) {
            disposers.get(key)!(); // Dispose the watcher
            disposers.delete(key);
          }
        }
      },
      $invalidate(keys: GetterKeys[]) {
        for (const key of keys) {
          if (disposers.has(key)) {
            disposers.get(key)!(); // Dispose the existing watcher
            disposers.delete(key);
          }
          const getterFn = getterFns[key];
          const disposer = watch((get) => {
            const value = getterFn(get);
            if (state[key as keyof typeof state] !== value) {
              (state as any)[key] = value;
            }
          });
          disposers.set(key, disposer);
        }
      },
    } as GettersControl<G>);
  }

  // Add actions
  if (actions) {
    Object.assign(state, actions);
  }

  // Return state with inferred getters and methods
  return state;
}

export { tawr, defineStore, useSnapshot };