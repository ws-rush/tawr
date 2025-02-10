import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineStore } from '../store'

describe('Store Queries', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should initialize query and execute automatically', async () => {
    const [, store] = defineStore({
      queries: {
        testQuery: () => ({
          fn: async () => 'test'
        })
      }
    })

    
    // Initial state should show loading
    expect(store.testQuery.value).toBe(undefined)
    expect(store.testQuery.isLoading).toBe(true)
    expect(store.testQuery.isFetching).toBe(true)
    expect(store.testQuery.error).toBe(null)

    // Wait for initial execution
    await new Promise(resolve => setTimeout(resolve, 0))

    // After execution
    expect(store.testQuery.value).toBe('test')
    expect(store.testQuery.isLoading).toBe(false)
    expect(store.testQuery.isFetching).toBe(false)
    expect(store.testQuery.error).toBe(null)
  })


  it('should handle loading states correctly', async () => {
    let resolveQuery: (value: string) => void
    const queryPromise = new Promise<string>(resolve => {
      resolveQuery = resolve
    })

    const [, store] = defineStore({
      queries: {
        testQuery: () => ({
          fn: () => queryPromise
        })
      }
    })

    
    // Initial state should be loading since value is undefined and query is fetching
    expect(store.testQuery.isLoading).toBe(true)
    expect(store.testQuery.isFetching).toBe(true)
    expect(store.testQuery.value).toBe(undefined)

    // Resolve the query
    resolveQuery!('result')
    await new Promise(resolve => setTimeout(resolve, 0))

    // After resolution, should not be loading since we have a value
    expect(store.testQuery.value).toBe('result')
    expect(store.testQuery.isLoading).toBe(false)
    expect(store.testQuery.isFetching).toBe(false)
  })

  it('should handle query errors', async () => {
    const error = new Error('Query failed')
    const [, store] = defineStore({
      queries: {
        testQuery: () => ({
          fn: async () => { throw error }
        })
      }
    })

    
    // Wait for query to complete
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(store.testQuery.error).toBe(error)
    expect(store.testQuery.isFetching).toBe(false)
  })

  it('should handle query invalidation', async () => {
    let count = 0
    const [, store] = defineStore({
      queries: {
        testQuery: () => ({
          fn: async () => {
            count++
            return `result ${count}`
          }
        })
      }
    })

    
    // Wait for initial automatic query
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(store.testQuery.value).toBe('result 1')
    expect(store.testQuery.isFetching).toBe(false)

    // Invalidate and check loading states
    store.$invalidate(['testQuery'])
    expect(store.testQuery.isFetching).toBe(true)
    // Should not be loading since we have a previous value
    expect(store.testQuery.isLoading).toBe(false)
    expect(store.testQuery.value).toBe('result 1') // Still has old value

    // Wait for re-fetch
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(store.testQuery.value).toBe('result 2')
    expect(store.testQuery.isFetching).toBe(false)
  })

  it('should handle undefined query result', async () => {
    const [, store] = defineStore({
      queries: {
        testQuery: () => ({
          fn: async () => undefined
        })
      }
    })

    
    // Wait for query to complete
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(store.testQuery.value).toBe(undefined)
    expect(store.testQuery.isFetching).toBe(false)
    expect(store.testQuery.error).toBe(null)
  })

  it('should handle query dependencies on state', async () => {
    const queryResults: string[] = []
    const [, store] = defineStore({
      state: () => ({
        id: 1
      }),
      queries: {
        testQuery: (store) => ({
          fn: async () => {
            const result = `result for id ${store.id}`
            queryResults.push(result)
            return result
          }
        })
      }
    })

    
    // Wait for initial automatic query
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(store.testQuery.value).toBe('result for id 1')
    expect(queryResults).toHaveLength(1)

    // Update state and verify re-fetch
    store.id = 2
    expect(store.testQuery.isFetching).toBe(true)
    // Should not be loading since we have previous value
    expect(store.testQuery.isLoading).toBe(false)
    
    // Wait for re-fetch
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(store.testQuery.value).toBe('result for id 2')
    expect(store.testQuery.isFetching).toBe(false)
    expect(queryResults).toHaveLength(2)
  })
})
