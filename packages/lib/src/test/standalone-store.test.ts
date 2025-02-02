import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineStore } from '../store';

describe('Store', () => {
  describe('Basic Store Operations', () => {
    const [, store] = defineStore({
      state: () => ({
        count: 0,
        first_name: 'john',
        last_name: 'doe'
      }),
      getters: {
        doubleCount: (store) => store.count * 2,
        full_name: (store) => `${store.first_name} ${store.last_name}`
      },
      actions: {
        increment() {
          this.count++;
        },
        setName(first: string, last: string) {
          this.first_name = first;
          this.last_name = last;
        }
      }
    });

    beforeEach(() => {
      // Reset state before each test
      store.count = 0;
      store.first_name = 'john';
      store.last_name = 'doe';
    });

    it('initializes with correct state', () => {
      expect(store.count).toBe(0);
      expect(store.first_name).toBe('john');
      expect(store.last_name).toBe('doe');
      expect(store.$state).toEqual({
        count: 0,
        first_name: 'john',
        last_name: 'doe'
      });
    });

    it('allows direct state access via $state', () => {
      store.$state.count = 5;
      expect(store.count).toBe(5);
      expect(store.$state.count).toBe(5);
    });

    it('computes getters correctly', () => {
      expect(store.doubleCount).toBe(0);
      expect(store.full_name).toBe('john doe');
    });

    it('updates state through actions', () => {
      store.actions.increment();
      expect(store.count).toBe(1);
      expect(store.doubleCount).toBe(2);

      store.actions.setName('jane', 'smith');
      expect(store.full_name).toBe('jane smith');
    });

    it('maintains reactivity between state and getters', () => {
      store.count = 5;
      expect(store.doubleCount).toBe(10);

      store.first_name = 'jane';
      expect(store.full_name).toBe('jane doe');
    });
  });

  describe('Getter Features', () => {
    describe('Basic Getters', () => {
      const [, store] = defineStore({
        state: () => ({ value: 1 }),
        getters: {
          doubled: (store) => store.value * 2,
          plusOne: (store) => store.value + 1
        }
      });

      it('computes independent getters correctly', () => {
        expect(store.doubled).toBe(2);
        expect(store.plusOne).toBe(2);

        store.value = 2;
        expect(store.doubled).toBe(4);
        expect(store.plusOne).toBe(3);
      });
    });

    describe('Dependent Getters', () => {
      const [, store] = defineStore({
        state: () => ({ count: 1 }),
        getters: {
          double: (store) => store.count * 2,
          quadruple: (store) => store.double * 2,
          octuple: (store) => store.quadruple * 2
        }
      });

      it('handles getter dependency chain correctly', () => {
        expect(store.double).toBe(2);
        expect(store.quadruple).toBe(4);
        expect(store.octuple).toBe(8);

        store.count = 2;
        expect(store.double).toBe(4);
        expect(store.quadruple).toBe(8);
        expect(store.octuple).toBe(16);
      });

      it('handles $underive for single getter', () => {
        store.count = 1;
        expect(store.double).toBe(2);
        expect(store.quadruple).toBe(4);

        store.$underive(['double']);
        store.count = 2;
        expect(store.double).toBe(2); // Should maintain old value
        expect(store.quadruple).toBe(4); // Should use underived value
      });

      it('handles $underive for multiple getters', () => {
        store.count = 1;
        store.$underive(['double', 'quadruple']);
        store.count = 2;
        expect(store.double).toBe(2);
        expect(store.quadruple).toBe(4);
        expect(store.octuple).toBe(8);
      });

      it('handles $invalidate after $underive', () => {
        store.count = 1;
        store.$underive(['double', 'quadruple']);
        store.count = 2;
        
        store.$invalidate(['double']);
        expect(store.double).toBe(4);
        expect(store.quadruple).toBe(4); // Still underived
        
        store.$invalidate(['quadruple']);
        expect(store.quadruple).toBe(8); // Now updated
        expect(store.octuple).toBe(16);
      });
    });
  });

  describe('Action Features', () => {
    describe('Synchronous Actions', () => {
      const [, store] = defineStore({
        state: () => ({ count: 0 }),
        actions: {
          increment() {
            this.count++;
          },
          add(value: number) {
            this.count += value;
          },
          reset() {
            this.count = 0;
          }
        }
      });

      it('handles multiple action calls correctly', () => {
        store.actions.increment();
        store.actions.increment();
        expect(store.count).toBe(2);

        store.actions.add(3);
        expect(store.count).toBe(5);

        store.actions.reset();
        expect(store.count).toBe(0);
      });
    });

    describe('Asynchronous Actions', () => {
      const [, store] = defineStore({
        state: () => ({ 
          count: 0,
          loading: false,
          error: null as string | null
        }),
        actions: {
          async successfulAsync() {
            this.loading = true;
            await new Promise(resolve => setTimeout(resolve, 10));
            this.count++;
            this.loading = false;
          }
        }
      });

      const [, errorStore] = defineStore({
        state: () => ({
          loading: false,
          error: null as string | null
        }),
        actions: {
          async failingAsync() {
            this.loading = true;
            try {
              await new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Failed')), 10)
              );
            } catch (e) {
              this.error = (e as Error).message;
            } finally {
              this.loading = false;
            }
          }
        }
      });

      it('handles successful async actions', async () => {
        expect(store.loading).toBe(false);
        const promise = store.actions.successfulAsync();
        expect(store.loading).toBe(true);
        
        await promise;
        expect(store.loading).toBe(false);
        expect(store.count).toBe(1);
        expect(store.error).toBe(null);
      });

      it('handles failing async actions', async () => {
        expect(errorStore.loading).toBe(false);
        const promise = errorStore.actions.failingAsync();
        expect(errorStore.loading).toBe(true);
        
        await promise;
        expect(errorStore.loading).toBe(false);
        expect(errorStore.error).toBe('Failed');
      });
    });
  });

  describe('Advanced Features', () => {
    describe('Promise-based Getters', () => {
      const mockPosts = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' }
      ];

      const mockFetch = vi.fn()
        .mockImplementation((url) => {
          if (url.includes('error')) {
            return Promise.reject(new Error('Network error'));
          }
          return Promise.resolve({
            json: () => Promise.resolve(mockPosts)
          });
        });

      beforeEach(() => {
        vi.stubGlobal('fetch', mockFetch);
      });

      const [, store] = defineStore({
        state: () => ({ 
          userId: 1,
          error: null as string | null
        }),
        getters: {
          posts: (store) => 
            fetch(`https://api.example.com/posts?userId=${store.userId}`)
              .then(response => response.json()),
          errorPosts: (store) =>
            fetch(`https://api.example.com/error?userId=${store.userId}`)
              .then(response => response.json())
              .catch(e => {
                store.error = e.message;
                return [];
              })
        },
        actions: {
          setUserId(id: number) {
            this.userId = id;
          }
        }
      });

      it('handles successful promise-based getters', async () => {
        const posts = await store.posts;
        expect(posts).toEqual(mockPosts);
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/posts?userId=1'
        );

        store.actions.setUserId(2);
        await store.posts;
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/posts?userId=2'
        );
      });

      it('handles errors in promise-based getters', async () => {
        const posts = await store.errorPosts;
        expect(posts).toEqual([]);
        expect(store.error).toBe('Network error');
      });
    });

    describe('Edge Cases', () => {
      it('handles undefined state values', () => {
        const [, store] = defineStore({
          state: () => ({ value: undefined as undefined | number }),
          getters: {
            isSet: (store) => store.value !== undefined
          }
        });

        expect(store.value).toBeUndefined();
        expect(store.isSet).toBe(false);

        store.value = 5;
        expect(store.isSet).toBe(true);
      });

      it('handles null state values', () => {
        const [, store] = defineStore({
          state: () => ({ value: null as null | number }),
          getters: {
            isNull: (store) => store.value === null
          }
        });

        expect(store.value).toBeNull();
        expect(store.isNull).toBe(true);

        store.value = 5;
        expect(store.isNull).toBe(false);
      });

      it('handles empty state', () => {
        const [, store] = defineStore({
          state: () => ({})
        });

        expect(store.$state).toEqual({});
      });

      it('handles store without getters', () => {
        const [, store] = defineStore({
          state: () => ({ value: 1 })
        });

        expect(store.value).toBe(1);
        store.value = 2;
        expect(store.value).toBe(2);
      });

      it('handles store without actions', () => {
        const [, store] = defineStore({
          state: () => ({ value: 1 }),
          getters: {
            doubled: (store) => store.value * 2
          }
        });

        expect(store.value).toBe(1);
        expect(store.doubled).toBe(2);
        expect(store.actions).toBeUndefined();
      });
    });
  });
});
