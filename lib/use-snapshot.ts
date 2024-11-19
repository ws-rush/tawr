import { useState, useEffect, useRef } from 'react'
import { watch} from '@vue/reactivity'

// Types
// type ReactiveObject = Record<string, any>
type PathKey = string | number
type Path = PathKey[]
// type Subscriber = () => void
// type SubscriptionMap = Map<string, Set<Subscriber>>

type StoreGetters<G> = { 
  [K in keyof G]: G[K] extends (state: any) => any ? ReturnType<G[K]> : never 
}
type StoreState<T> = { [K in keyof T]: T[K] }
type StoreActions<A> = { [K in keyof A]: A[K] }

type Store<
  T extends object, 
  G extends Record<string, (state: T) => any>, 
  A extends Record<string, (...args: any[]) => any>
> = StoreState<T> & StoreGetters<G> & {
  $state: T
  actions: StoreActions<A>
}

type StoreSnapshot<
  T extends object, 
  G extends Record<string, (state: T) => any>
> = StoreState<T> & StoreGetters<G> & {
  $state: T
}

// Global subscription store
// const subscriptions = new WeakMap<ReactiveObject, SubscriptionMap>()

// Type guard
function isStore(obj: any): obj is Store<any, any, any> {
  return obj && typeof obj === 'object' && '$state' in obj && 'actions' in obj
}

function createSnapshot<
  T extends object,
  G extends Record<string, (state: T) => any>
>(
  store: Store<T, G, any>,
  trackAccess: (path: Path) => void
): StoreSnapshot<T, G> {
  const seen = new WeakSet()

  const createProxy = (obj: any, path: Path = []): any => {
    if (typeof obj !== 'object' || obj === null || seen.has(obj)) {
      return obj
    }

    seen.add(obj)

    return new Proxy(obj, {
      get(target, key) {
        // Exclude actions from the snapshot
        if (key === 'actions') {
          return undefined
        }

        const currentPath = [...path, key as PathKey]
        trackAccess(currentPath)

        const value = target[key]
        if (typeof value === 'function') {
          return value.bind(target)
        }

        return createProxy(value, currentPath)
      },
      set() {
        return false // Immutable
      },
      deleteProperty() {
        return false // Immutable
      }
    })
  }

  return createProxy(store) as StoreSnapshot<T, G>
}

export function useSnapshot<
  T extends object,
  G extends Record<string, (state: T) => any>,
  A extends Record<string, (...args: any[]) => any>
>(store: Store<T, G, A>): StoreSnapshot<T, G> {
  if (!isStore(store)) {
    throw new Error('useSnapshot requires a store created with defineStore()')
  }

  const [, forceUpdate] = useState(0)
  const accessedPaths = useRef(new Set<string>())
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const trackAccess = (path: Path) => {
    accessedPaths.current.add(path.join('.'))
  }

  useEffect(() => {
    const paths = Array.from(accessedPaths.current)
    const cleanups: (() => void)[] = []

    paths.forEach(pathKey => {
      const path = pathKey.split('.')
      const stopWatch = watch(
        () => {
          let value = store
          for (const key of path) {
            value = value[key]
          }
          return value
        },
        () => {
          if (mountedRef.current) {
            forceUpdate(n => n + 1)
          }
        },
        // @ts-expect-error handle later
        { flush: 'sync' }
      )
      cleanups.push(stopWatch)
    })

    return () => cleanups.forEach(cleanup => cleanup())
  }, [store])

  accessedPaths.current = new Set()
  return createSnapshot(store, trackAccess)
}