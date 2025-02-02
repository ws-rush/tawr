import { defineStore } from '../store';

// This should show type errors if inference is incorrect
const [, store] = defineStore({
  state: () => ({
    count: 0,
    name: 'test'
  }),
  getters: {
    doubled: state => state.count * 2,
    greeting: state => `Hello ${state.name}`,
    // This should have proper type inference from the 'doubled' getter
    quadrupled: state => state.doubled * 2
  }
});

// TypeScript should infer these types correctly
const doubled: number = store.doubled;
const greeting: string = store.greeting;
const quadrupled: number = store.quadrupled;

console.log(doubled, greeting, quadrupled)

// Testing $invalidate type inference
store.$invalidate(['doubled']); // Should work
store.$invalidate(['greeting']); // Should work
store.$invalidate(['quadrupled']); // Should work
// @ts-ignore
store.$invalidate(['nonexistent']); // Should show type error

// Testing $underive type inference
store.$underive(['doubled']); // Should work
store.$underive(['greeting']); // Should work
store.$underive(['quadrupled']); // Should work
// @ts-ignore
store.$underive(['nonexistent']); // Should show type error
