import { describe, it, expect, vi } from 'vitest';
import { defineStore } from '../store';

describe('Create Store Mechanism', () => {
    it('works with only state', () => {
      const [,store] = defineStore({
        state: () => ({ count: 0 })
      });
      expect(store.count).toBe(0);
      store.count = 1;
      expect(store.count).toBe(1);
    });

    it('works with only getters', () => {
      const [,store] = defineStore({
        getters: {
          currentTime: () => Date.now()
        }
      });
      expect(typeof store.currentTime).toBe('number');
    });

    it('works with only actions', () => {
      const mockFn = vi.fn();
      const [,store] = defineStore({
        actions: {
          doSomething() {
            mockFn();
          }
        }
      });
      store.actions.doSomething();
      expect(mockFn).toHaveBeenCalled();
    });

    it('works with state and getters (no actions)', () => {
      const [,store] = defineStore({
        state: () => ({ value: 5 }),
        getters: {
          doubled: (store) => store.value * 2
        }
      });
      expect(store.value).toBe(5);
      expect(store.doubled).toBe(10);
    });

    it('works with state and actions (no getters)', () => {
      const [,store] = defineStore({
        state: () => ({ count: 0 }),
        actions: {
          increment() {
            this.count++;
          }
        }
      });
      store.actions.increment();
      expect(store.count).toBe(1);
    });

    it('works with getters and actions (no state)', () => {
      const [,store] = defineStore({
        getters: {
          randomValue: () => Math.random()
        },
        actions: {
          logValue() {
            return this.randomValue;
          }
        }
      });
      expect(typeof store.actions.logValue()).toBe('number');
    });

    it('works with all features combined (state + getters + actions)', () => {
      const [,store] = defineStore({
        state: () => ({ count: 0, name: 'john' }),
        getters: {
          doubled: (store) => store.count * 2,
          quadrupled: (store) => store.doubled * 2,
          fullName: (store) => `${store.name} doe`
        },
        actions: {
          increment() {
            this.count++;
          },
          setName(name: string) {
            this.name = name;
          }
        }
      });

      expect(store.count).toBe(0);
      expect(store.doubled).toBe(0);
      expect(store.quadrupled).toBe(0);
      expect(store.fullName).toBe('john doe');

      store.actions.increment();
      expect(store.count).toBe(1);
      expect(store.doubled).toBe(2);
      expect(store.quadrupled).toBe(4);

      store.actions.setName('jane');
      expect(store.fullName).toBe('jane doe');
    });

    it('properly binds this context in actions', () => {
      const [,store] = defineStore({
        state: () => ({ count: 0 }),
        getters: {
          doubled: (store) => store.count * 2
        },
        actions: {
          increment() {
            // Access state
            this.count++;
            // Access getter
            const doubled = this.doubled;
            return doubled;
          }
        }
      });

      const result = store.actions.increment();
      expect(result).toBe(2); // doubled value after increment
      expect(store.count).toBe(1);
    });
});
