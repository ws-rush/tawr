import { describe, it, expect, vi } from 'vitest';
import { defineStore } from '../store';

describe('Actions', () => {
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
      store.increment();
      store.increment();
      expect(store.count).toBe(2);

      store.add(3);
      expect(store.count).toBe(5);

      store.reset();
      expect(store.count).toBe(0);
    });

    it('properly binds this context', () => {
      const [, store] = defineStore({
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

      const result = store.increment();
      expect(result).toBe(2); // doubled value after increment
      expect(store.count).toBe(1);
    });
  });

  describe('Asynchronous Actions', () => {
    const [, store] = defineStore({
      state: () => ({ 
        count: 0,
        isLoading: false,
        error: null as string | null
      }),
      actions: {
        async successfulAsync() {
          this.isLoading = true;
          await new Promise(resolve => setTimeout(resolve, 10));
          this.count++;
          this.isLoading = false;
        },
        async failingAsync() {
          this.isLoading = true;
          try {
            await new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Failed')), 10)
            );
          } catch (e) {
            this.error = (e as Error).message;
          } finally {
            this.isLoading = false;
          }
        }
      }
    });

    it('handles successful async actions', async () => {
      expect(store.isLoading).toBe(false);
      const promise = store.successfulAsync();
      expect(store.isLoading).toBe(true);
      
      await promise;
      expect(store.isLoading).toBe(false);
      expect(store.count).toBe(1);
      expect(store.error).toBe(null);
    });

    it('handles failing async actions', async () => {
      expect(store.isLoading).toBe(false);
      const promise = store.failingAsync();
      expect(store.isLoading).toBe(true);
      
      await promise;
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Failed');
    });
  });

  describe('Actions with Dependencies', () => {
    const [, store] = defineStore({
      state: () => ({
        items: [] as string[],
        isLoading: false
      }),
      getters: {
        itemCount: (store) => store.items.length,
        hasItems: (store) => store.items.length > 0
      },
      actions: {
        async fetchItems() {
          this.isLoading = true;
          await new Promise(resolve => setTimeout(resolve, 10));
          this.items = ['item1', 'item2'];
          this.isLoading = false;
        },
        async addItem(item: string) {
          if (!this.hasItems) {
            await this.fetchItems();
          }
          this.items = [...this.items, item];
        }
      }
    });

    it('handles actions with getter dependencies', async () => {
      expect(store.hasItems).toBe(false);
      expect(store.itemCount).toBe(0);

      await store.addItem('item3');
      expect(store.hasItems).toBe(true);
      expect(store.itemCount).toBe(3);
      expect(store.items).toEqual(['item1', 'item2', 'item3']);
    });
  });

  describe('Action Side Effects', () => {
    it('handles external side effects', () => {
      const externalApi = {
        save: vi.fn()
      };

      const [, store] = defineStore({
        state: () => ({ value: '' }),
        actions: {
          async save(newValue: string) {
            this.value = newValue;
            await externalApi.save(newValue);
          }
        }
      });

      store.save('test');
      expect(externalApi.save).toHaveBeenCalledWith('test');
      expect(store.value).toBe('test');
    });
  });

  describe('Action Error Handling', () => {
    it('handles errors in action chain', async () => {
      const [, store] = defineStore({
        state: () => ({
          value: '',
          error: null as string | null,
          rollbackValue: null as string | null
        }),
        actions: {
          async riskyAction(newValue: string) {
            this.rollbackValue = this.value;
            try {
              this.value = newValue;
              if (newValue === 'error') {
                throw new Error('Invalid value');
              }
            } catch (e) {
              this.value = this.rollbackValue;
              this.error = (e as Error).message;
              throw e;
            }
          }
        }
      });

      // Successful case
      await store.riskyAction('valid');
      expect(store.value).toBe('valid');
      expect(store.error).toBe(null);

      // Error case
      try {
        await store.riskyAction('error');
      } catch (e) {
        expect(store.value).toBe('valid'); // Rolled back
        expect(store.error).toBe('Invalid value');
      }
    });
  });
});
