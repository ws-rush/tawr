import { reactive, computed } from "@vue/reactivity";

export type Getters<T> = Record<string, (store: T & GettersReturn<Getters<T>>) => any>;
export type Actions = Record<string, (...args: any[]) => any>;

export type GettersReturn<G> = {
  [K in keyof G]: G[K] extends (...args: any[]) => infer R ? R : never;
};

export type State<T> = {
  [K in keyof T]-?: T[K];
};

export type StoreDefinition<T extends object, G extends Getters<T>, A extends Actions> = {
  state(): T;
  getters?: G;
  actions?: A;
};

export type Store<T extends object, G extends Getters<T>, A extends Actions> = State<T> &
  GettersReturn<G> & {
    $state: T;
    actions: A;
    $underive(keys: (keyof GettersReturn<G>)[]): void;
    $invalidate(keys: (keyof GettersReturn<G>)[]): void;
  };

export function defineStore<T extends object, G extends Getters<T> = {}, A extends Actions = {}>(definition: StoreDefinition<T, G, A>): Store<T, G, A> {
  const initialState = definition.state();
  const state = reactive(initialState) as T;

  const store = {
    $state: state,
    $underive: (keys: (keyof GettersReturn<G>)[]) => {
      keys.forEach((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(store, key);
        if (descriptor && typeof descriptor.get === 'function') {
          const currentValue = descriptor.get.call(store);
          Object.defineProperty(store, key, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: currentValue,
          });
        }
      });
    },
    $invalidate: (keys: (keyof GettersReturn<G>)[]): void => {
      keys.forEach((key) => {
        store.$underive([key]);
        if (definition.getters && key in definition.getters) {
          const getter = definition.getters[key];
          const computedRef = computed(() => getter(store));
          Object.defineProperty(store, key, {
            get: () => computedRef.value,
            enumerable: true,
            configurable: true,
          });
        }
      });
    },
  } as Store<T, G, A>;

  Object.keys(state).forEach((key) => {
    Object.defineProperty(store, key, {
      get: () => state[key as keyof T],
      set: (value) => {
        state[key as keyof T] = value;
      },
      enumerable: true,
      configurable: true,
    });
  });

  if (definition.getters) {
    Object.entries(definition.getters).forEach(([key, fn]) => {
      const computedRef = computed(() => fn(store));
      Object.defineProperty(store, key, {
        get: () => computedRef.value,
        enumerable: true,
        configurable: true,
      });
    });
  }

  if (definition.actions) {
    const boundActions = {} as A;

    Object.entries(definition.actions).forEach(([key, fn]) => {
      boundActions[key as keyof A] = fn.bind(null) as A[keyof A];
    });

    store.actions = boundActions;
  }

  return store;
}