import { proxy, useSnapshot } from 'valtio';
import { derive } from 'derive-valtio';

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

function defineStore<S extends object, G extends Getters, A extends Actions>(
  storeDefinition: StoreDefinition<S, G, A>
): StoreType<S, G, A> {
  const { state: stateFunc, getters, actions } = storeDefinition;

  const proxyState = proxy<S>(stateFunc());
  const state = proxyState as StoreType<S, G, A>;

  if (getters) {
    derive(getters(state as S), {
      proxy: state,
    });
  }

  if (actions) {
    Object.assign(state, actions);
  }

  return state;
}

export { defineStore, useSnapshot };