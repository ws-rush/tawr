import { describe, it, expect, vi } from 'vitest';
import { defineStore } from '../store';

describe('Store', () => {
  describe('Basic Store Functionality', () => {
    const [,store] = defineStore({
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

    it('initializes with correct state', () => {
      expect(store.count).toBe(0);
      expect(store.first_name).toBe('john');
      expect(store.last_name).toBe('doe');
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
    });
  });

  describe('Advanced Features', () => {
    describe('Getter Dependencies', () => {

      const [,store] = defineStore({
        state: () => ({ count: 1 }),
        getters: {
          double: (store) => store.count * 2,
          quadruple: (store) => store.double * 2
        }
      });

      it('handles dependent getters correctly', () => {
        expect(store.double).toBe(2);
        expect(store.quadruple).toBe(4);

        store.count = 2;
        expect(store.double).toBe(4);
        expect(store.quadruple).toBe(8);
      });

      it('handles $underive and $invalidate', () => {
        store.count = 1;
        expect(store.double).toBe(2);
        expect(store.quadruple).toBe(4);

        // Underive the getter
        store.$underive(['double']);
        store.count = 2;
        // The underived getter should maintain its old value
        expect(store.double).toBe(2);
        
        // Invalidate the getter
        store.$invalidate(['double']);
        // The getter should now update
        expect(store.double).toBe(4);
        expect(store.quadruple).toBe(8);
      });
    });

    describe('Async Features', () => {
      it('handles async actions', async () => {
        const [,store] = defineStore({
          state: () => ({ count: 0 }),
          actions: {
            async asyncIncrement() {
              await new Promise(resolve => setTimeout(resolve, 10));
              this.count++;
            }
          }
        });

        await store.actions.asyncIncrement();
        expect(store.count).toBe(1);
      });

      it('handles promise-based getters', async () => {
        const mockPosts = [
          { id: 1, title: 'Post 1' },
          { id: 2, title: 'Post 2' }
        ];

        const mockFetch = vi.fn().mockResolvedValue({
          json: () => Promise.resolve(mockPosts)
        });
        vi.stubGlobal('fetch', mockFetch);

        const [,store] = defineStore({
          state: () => ({ userId: 1 }),
          getters: {
            posts: (store) => 
              fetch(`https://jsonplaceholder.typicode.com/posts?userId=${store.userId}`)
                .then(response => response.json())
          },
          actions: {
            setUserId(id: number) {
              this.userId = id;
            }
          }
        });

        const posts = await store.posts;
        expect(posts).toEqual(mockPosts);
        expect(mockFetch).toHaveBeenCalledWith(
          'https://jsonplaceholder.typicode.com/posts?userId=1'
        );

        store.actions.setUserId(2);
        await store.posts;
        expect(mockFetch).toHaveBeenCalledWith(
          'https://jsonplaceholder.typicode.com/posts?userId=2'
        );
      });
    });
  });
});
