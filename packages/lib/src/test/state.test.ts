import { describe, it, expect } from 'vitest';
import { defineStore } from '../store';

describe('State', () => {
  describe('Basic State Operations', () => {
    it('initializes with correct state', () => {
      const store = defineStore({
        state: () => ({ count: 0, first_name: 'john', last_name: 'doe' })
      });
      expect(store.count).toBe(0);
      expect(store.first_name).toBe('john');
      expect(store.last_name).toBe('doe');
    });

    it('handles undefined state values', () => {
      const store = defineStore({
        state: () => ({ value: undefined as undefined | number })
      });
      expect(store.value).toBeUndefined();
      store.value = 5;
      expect(store.value).toBe(5);
    });

    it('handles null state values', () => {
      const store = defineStore({
        state: () => ({ value: null as null | number })
      });
      expect(store.value).toBeNull();
      store.value = 5;
      expect(store.value).toBe(5);
    });

    it('handles empty state', () => {
      const store = defineStore({
        state: () => ({})
      });
      const stateKeys = Object.keys(store).filter(key => !key.startsWith('$'));
      expect(stateKeys).toEqual([]);
    });
  });

  describe('Nested State Reactivity', () => {
    describe('Object Nesting', () => {
      const store = defineStore({
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
        })
      });

      it('maintains reactivity for deeply nested properties', () => {
        expect(store.user.profile.settings.theme).toBe('dark');
        
        store.user.profile.settings.theme = 'light';
        expect(store.user.profile.settings.theme).toBe('light');
        
        store.user.profile.name = 'Jane';
        expect(store.user.profile.name).toBe('Jane');
      });

      it('maintains reactivity when updating nested objects', () => {
        store.user.profile.settings = { theme: 'system', notifications: false };
        expect(store.user.profile.settings.theme).toBe('system');
        expect(store.user.profile.settings.notifications).toBe(false);
        
        store.user.profile = {
          name: 'Alice',
          settings: { theme: 'dark', notifications: true }
        };
        expect(store.user.profile.name).toBe('Alice');
        expect(store.user.profile.settings.notifications).toBe(true);
      });
    });

    describe('Array Nesting', () => {
      const store = defineStore({
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
        })
      });

      it('maintains reactivity for nested arrays', () => {
        store.todos[0].subtasks[0].done = true;
        expect(store.todos[0].subtasks[0].done).toBe(true);
        
        store.todos[1].subtasks.push({ id: 22, done: true });
        expect(store.todos[1].subtasks.length).toBe(2);
        expect(store.todos[1].subtasks[1].done).toBe(true);
      });

      it('maintains reactivity when updating array elements', () => {
        const updatedTodoFirst = {
          ...store.todos[0],
          subtasks: [
            { id: 11, done: true },
            { id: 12, done: true }
          ]
        };
        const updatedTodoSecond = {
          ...store.todos[1],
        };
        store.todos = [updatedTodoFirst, updatedTodoSecond];
        
        expect(store.todos[0].title).toBe('Task 1');
        expect(store.todos[0].subtasks[0].done).toBe(true);
        expect(store.todos[0].subtasks[1].done).toBe(true);
      });

      it('maintains reactivity with array methods', () => {
        const newTodo = {
          id: 3,
          title: 'Task 3',
          subtasks: [{ id: 31, done: true }]
        };
        store.todos = [...store.todos, newTodo];
        expect(store.todos.length).toBe(3);
        
        store.todos = store.todos.slice(1);
        expect(store.todos.length).toBe(2);
      });
    });
  });
});
