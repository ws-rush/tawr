import { reactive, computed } from '@vue/reactivity'

type Getters<T> = Record<string, (state: T) => any>
type Actions = Record<string, (...args: any[]) => any>

// Helper types to infer return types of getters and actions
type GettersReturn<G extends Getters<any>> = {
  [K in keyof G]: ReturnType<G[K]>
}

type State<T> = {
  [K in keyof T]: T[K]
}

type StoreDefinition<T extends object, G extends Getters<T>, A extends Actions> = {
  state(): T
  getters?: G
  actions?: A
}

// Combined store type that includes state, getters, and actions
type Store<T extends object, G extends Getters<T>, A extends Actions> = 
  State<T> & 
  GettersReturn<G> & {
    $state: T
    actions: A
  }

export function defineStore<
  T extends object,
  G extends Getters<T>,
  A extends Actions
>(definition: StoreDefinition<T, G, A>): Store<T, G, A> {
  // Create reactive state
  const initialState = definition.state()
  const state = reactive(initialState) as T

  // Create store object that will hold state, computed properties, and actions
  const store = {
    $state: state,
  } as Store<T, G, A>

  // Add direct access to state properties
  Object.keys(state).forEach(key => {
    Object.defineProperty(store, key, {
      get: () => state[key as keyof T],
      set: (value) => {
        state[key as keyof T] = value
      },
      enumerable: true
    })
  })

  // Add computed properties
  if (definition.getters) {
    Object.entries(definition.getters).forEach(([key, fn]) => {
      const computedRef = computed(() => fn(state))
      Object.defineProperty(store, key, {
        get: () => computedRef.value,
        enumerable: true
      })
    })
  }

  // Add actions
  if (definition.actions) {
    const boundActions = {} as A
    
    Object.entries(definition.actions).forEach(([key, fn]) => {
      boundActions[key as keyof A] = fn.bind(store) as A[keyof A]
    })

    store.actions = boundActions
  }

  return store
}