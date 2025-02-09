import { describe, it, expect, beforeEach } from 'vitest';
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
    });

    it('computes getters correctly', () => {
      expect(store.doubleCount).toBe(0);
      expect(store.full_name).toBe('john doe');
    });

    it('updates state through actions', () => {
      store.increment();
      expect(store.count).toBe(1);
      expect(store.doubleCount).toBe(2);

      store.setName('jane', 'smith');
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
        store.increment();
        store.increment();
        expect(store.count).toBe(2);

        store.add(3);
        expect(store.count).toBe(5);

        store.reset();
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
        const promise = store.successfulAsync();
        expect(store.loading).toBe(true);
        
        await promise;
        expect(store.loading).toBe(false);
        expect(store.count).toBe(1);
        expect(store.error).toBe(null);
      });

      it('handles failing async actions', async () => {
        expect(errorStore.loading).toBe(false);
        const promise = errorStore.failingAsync();
        expect(errorStore.loading).toBe(true);
        
        await promise;
        expect(errorStore.loading).toBe(false);
        expect(errorStore.error).toBe('Failed');
      });
    });
  });

  describe('Advanced Features', () => {
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

        // Exclude all props starting with $ and check if the remaining state is empty
        const stateKeys = Object.keys(store).filter(key => !key.startsWith('$'));
        expect(stateKeys).toEqual([]);
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
      });
    });
  });

  describe('Nested State Reactivity', () => {
    describe('Object Nesting', () => {
      const [, store] = defineStore({
        state: () => ({
          user: {
            profile: {
              name: 'John',
              settings: {
                theme: 'dark',
                notifications: true
              }
            },
            preferences: {
              language: 'en'
            }
          }
        }),
        getters: {
          themeAndName: (store) => 
            `${store.user.profile.name} - ${store.user.profile.settings.theme}`,
          isNotificationsEnabled: (store) => 
            store.user.profile.settings.notifications
        }
      });

      it('maintains reactivity for deeply nested properties', () => {
        expect(store.user.profile.settings.theme).toBe('dark');
        
        store.user.profile.settings.theme = 'light';
        expect(store.user.profile.settings.theme).toBe('light');
        expect(store.themeAndName).toBe('John - light');
        
        store.user.profile.name = 'Jane';
        expect(store.themeAndName).toBe('Jane - light');
      });

      it('maintains reactivity when updating nested objects', () => {
        store.user.profile.settings = { theme: 'system', notifications: false };
        expect(store.user.profile.settings.theme).toBe('system');
        expect(store.isNotificationsEnabled).toBe(false);
        
        store.user.profile = {
          name: 'Alice',
          settings: { theme: 'dark', notifications: true }
        };
        expect(store.user.profile.name).toBe('Alice');
        expect(store.isNotificationsEnabled).toBe(true);
      });
    });

    describe('Array Nesting', () => {
      const [, store] = defineStore({
        state: () => ({
          todos: [
            { 
              id: 1, 
              title: 'Task 1',
              subtasks: [
                { id: 11, done: false },
                { id: 12, done: true }
              ]
            },
            {
              id: 2,
              title: 'Task 2',
              subtasks: [
                { id: 21, done: false }
              ]
            }
          ]
        }),
        getters: {
          completedSubtasks: (store) => {
            const count = store.todos.reduce((count, todo) => {
              const completedCount = todo.subtasks.filter(subtask => subtask.done).length;
              return count + completedCount;
            }, 0);
            return count;
          }
        }
      });

      it('maintains reactivity for nested arrays', () => {
        expect(store.completedSubtasks).toBe(1);
        
        store.todos[0].subtasks[0].done = true;
        expect(store.completedSubtasks).toBe(2);
        
        store.todos[1].subtasks.push({ id: 22, done: true });
        expect(store.completedSubtasks).toBe(3);
      });

      it('maintains reactivity when updating array elements', () => {

        // Update the first todo's subtasks
        const updatedTodoFirst = {
          ...store.todos[0],
          subtasks: [
            { id: 11, done: true },
            { id: 12, done: true }
          ]
        };
        const updatedTodoSecond = {
          ...store.todos[1],
        }
        store.todos = [
          updatedTodoFirst,
          updatedTodoSecond
        ];
        
        expect(store.todos[0].title).toBe('Task 1');
        expect(store.completedSubtasks).toBe(3);
      });

      it('maintains reactivity with array methods', () => {
        // Add new todo
        const newTodo = {
          id: 3,
          title: 'Task 3',
          subtasks: [{ id: 31, done: true }]
        };
        store.todos = [...store.todos, newTodo];

        expect(store.completedSubtasks).toBe(4);
        
        // Remove first todo by creating new array without it
        store.todos = store.todos.slice(1);
        
        expect(store.completedSubtasks).toBe(2);
      });
    });
  });
});
