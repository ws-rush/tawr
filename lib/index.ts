import { proxy, useSnapshot as useSnapshotOrig } from 'valtio';
import { derive, underive } from 'derive-valtio';

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

type StoreType<S, G, A> = S & GetterReturnTypes<G> & A & {
  $underive: (keys: (keyof G)[]) => void;
  $invalidate: (keys: (keyof G)[]) => void;
};

function defineStore<S extends object, G extends Getters, A extends Actions>(
  storeDefinition: StoreDefinition<S, G, A>
): StoreType<S, G, A> {
  const { state: stateFunc, getters: gettersFunc, actions } = storeDefinition;

  const proxyState = proxy<S>(stateFunc());
  const state = proxyState as StoreType<S, G, A>;

  if (gettersFunc) {
    const getters = gettersFunc(state as S)
    
    derive(getters, {
      proxy: state,
    });

     // Add $underive method
     state.$underive = (keys: (keyof G)[]) => {
      if (keys && keys.length > 0) {
        underive(state, { keys: keys.map(String), delete: true });
      } else {
        underive(state);
      }
    };

    // Add $invalidate method
    state.$invalidate = (keys: (keyof G)[]) => {
      if (keys && keys.length > 0) {
        // Underive specified getters
        underive(state, { keys: keys.map(String), delete: true });
        // Re-derive specified getters
        const gettersToDerive = {} as Partial<G>;
        for (const key of keys) {
          gettersToDerive[key] = getters[key];
        }
        derive(gettersToDerive as G, { proxy: state });
      } else {
        // Underive all getters
        underive(state);
        // Re-derive all getters
        derive(getters, { proxy: state });
      }
    };
  }

  if (actions) {
    Object.assign(state, actions);
  }

  return state;
}

const useSnapshot = <T extends object>(proxyObject: T) => {
  const snap = useSnapshotOrig(proxyObject);
  return snap as DeepWritable<T>;
};

export { defineStore, useSnapshot };