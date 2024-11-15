import { proxy, useSnapshot } from "valtio";
import { derive, underive } from "derive-valtio";

// Action subscriber types
type ActionSubscriber = (context: ActionContext) => void;

type ActionContext = {
  name: string;
  store: any;
  args: any[];
  after: (callback: (result: any) => void) => void;
  onError: (callback: (error: any) => void) => void;
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

type StoreType<S, G, A> = S &
  GetterReturnTypes<G> & {
    actions: A;
    $underive: (keys: (keyof G)[]) => void;
    $invalidate: (keys: (keyof G)[]) => void;
    $onAction: (subscriber: ActionSubscriber) => () => void;
  };

function defineStore<S extends object, G extends Getters, A extends Actions>(
  storeDefinition: StoreDefinition<S, G, A>
): StoreType<S, G, A> {
  const {
    state: stateFunc,
    getters: gettersFunc,
    actions: rawActions,
  } = storeDefinition;

  const proxyState = proxy<S>(stateFunc());
  const state = proxyState as StoreType<S, G, A>;

  // Action subscribers
  const subscribers = new Set<ActionSubscriber>();

  if (gettersFunc) {
    const getters = gettersFunc(state as S);

    derive(getters, {
      proxy: state,
    });

    state.$underive = (keys: (keyof G)[]) => {
      if (keys && keys.length > 0) {
        underive(state, { keys: keys.map(String), delete: true });
      } else {
        underive(state);
      }
    };

    state.$invalidate = (keys: (keyof G)[]) => {
      if (keys && keys.length > 0) {
        underive(state, { keys: keys.map(String), delete: true });
        const gettersToDerive = {} as Partial<G>;
        for (const key of keys) {
          gettersToDerive[key] = getters[key];
        }
        derive(gettersToDerive as G, { proxy: state });
      } else {
        underive(state);
        derive(getters, { proxy: state });
      }
    };
  }

  // Add $onAction method
  state.$onAction = (subscriber: ActionSubscriber) => {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  };

  // Wrap actions with subscription handling
  if (rawActions) {
    const wrappedActions = {} as A;

    for (const [name, action] of Object.entries(rawActions)) {
      const wrappedAction = (...args: Parameters<typeof action>) => {
        let afterCallbacks: ((result: any) => void)[] = [];
        let errorCallbacks: ((error: any) => void)[] = [];

        const actionContext: ActionContext = {
          name,
          store: state,
          args,
          after: (callback) => {
            afterCallbacks.push(callback);
          },
          onError: (callback) => {
            errorCallbacks.push(callback);
          },
        };

        // Notify subscribers before action
        subscribers.forEach((subscriber) => {
          subscriber(actionContext);
        });

        let result: any;
        try {
          result = action.apply(state, args);

          // Handle promise results
          if (result instanceof Promise) {
            return result
              .then((value) => {
                afterCallbacks.forEach((cb) => cb(value));
                return value;
              })
              .catch((error) => {
                errorCallbacks.forEach((cb) => cb(error));
                throw error;
              });
          }

          // Handle synchronous results
          afterCallbacks.forEach((cb) => cb(result));
          return result;
        } catch (error) {
          // Handle synchronous errors
          errorCallbacks.forEach((cb) => cb(error));
          throw error;
        }
      };

      // Use type assertion to assign the wrapped action
      (wrappedActions as any)[name] = wrappedAction;
    }

    // Add actions as a property of the store
    Object.defineProperty(state, "actions", {
      value: wrappedActions,
      enumerable: true,
      configurable: true,
    });

    // Also add actions directly to the store
    Object.assign(state, wrappedActions);
  }

  return state;
}

export { defineStore, useSnapshot };
