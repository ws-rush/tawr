import { describe, it, expect } from 'vitest';
import { defineStore } from '../store';

describe('Getters', () => {
  describe('Basic Getters', () => {
    const store = defineStore({
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
    const store = defineStore({
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

  describe('Complex Getter Dependencies', () => {
    const store = defineStore({
      state: () => ({ 
        firstName: 'John',
        lastName: 'Doe',
        age: 25
      }),
      getters: {
        fullName: (store) => `${store.firstName} ${store.lastName}`,
        displayName: (store) => `${store.fullName} (${store.age})`,
        greeting: (store) => `Hello, ${store.displayName}!`
      }
    });

    it('updates through getter dependency chain', () => {
      expect(store.fullName).toBe('John Doe');
      expect(store.displayName).toBe('John Doe (25)');
      expect(store.greeting).toBe('Hello, John Doe (25)!');

      store.firstName = 'Jane';
      expect(store.fullName).toBe('Jane Doe');
      expect(store.displayName).toBe('Jane Doe (25)');
      expect(store.greeting).toBe('Hello, Jane Doe (25)!');

      store.age = 30;
      expect(store.fullName).toBe('Jane Doe');
      expect(store.displayName).toBe('Jane Doe (30)');
      expect(store.greeting).toBe('Hello, Jane Doe (30)!');
    });

    it('handles $underive and $invalidate in complex chains', () => {
      store.firstName = 'John';
      store.lastName = 'Doe';
      store.age = 25;

      store.$underive(['fullName', 'displayName']);
      store.firstName = 'Jane';
      expect(store.fullName).toBe('John Doe'); // Underived
      expect(store.displayName).toBe('John Doe (25)'); // Underived
      expect(store.greeting).toBe('Hello, John Doe (25)!'); // Uses underived values

      store.$invalidate(['fullName']);
      expect(store.fullName).toBe('Jane Doe'); // Updated
      expect(store.displayName).toBe('John Doe (25)'); // Still underived
      expect(store.greeting).toBe('Hello, John Doe (25)!'); // Uses mixed values

      store.$invalidate(['displayName']);
      expect(store.displayName).toBe('Jane Doe (25)'); // Now updated
      expect(store.greeting).toBe('Hello, Jane Doe (25)!'); // Fully updated
    });
  });

  describe('Getters with Object/Array Returns', () => {
    const store = defineStore({
      state: () => ({
        items: [1, 2, 3, 4, 5],
        config: { multiplier: 2 }
      }),
      getters: {
        processedItems: (store) => 
          store.items.map(item => item * store.config.multiplier),
        itemsStats: (store) => ({
          sum: store.processedItems.reduce((a: number, b: number) => a + b, 0),
          count: store.processedItems.length
        })
      }
    });

    it('handles getters returning arrays', () => {
      expect(store.processedItems).toEqual([2, 4, 6, 8, 10]);
      
      store.config.multiplier = 3;
      expect(store.processedItems).toEqual([3, 6, 9, 12, 15]);
      
      store.items = [1, 2, 3];
      expect(store.processedItems).toEqual([3, 6, 9]);
    });

    it('handles getters returning objects', () => {
      store.items = [1, 2, 3, 4, 5];
      store.config.multiplier = 2;
      
      expect(store.itemsStats).toEqual({
        sum: 30,
        count: 5
      });
      
      store.items = [1, 2, 3];
      expect(store.itemsStats).toEqual({
        sum: 12,
        count: 3
      });
    });
  });
});
