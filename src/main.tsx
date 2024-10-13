import React from 'react';
import { createRoot } from 'react-dom/client';

import { defineStore, useSnapshot } from '../lib';

const counter = await defineStore({
  async state() {
    return {
      count: 0,
      first_name: 'john',
      last_name: 'doe'
    }
  },
  getters(state) {
    return {
      doubleCount: (get) => get(state).count * 2,
      full_name: (get) => `${get(state).first_name} ${get(state).last_name}`
    }
  },
  actions: {
    inc() {
      this.count++
    },
    dec() {
      this.count--
    },
    incBy(num: number) {
      this.count += num
    },
    decBy(num: number) {
      this.count += num
    },
    rename(first_name: string, last_name: string) {
      this.first_name = first_name
      this.last_name = last_name
    }
  }
})

function Actions() {
  return <div>
    <button type="button" onClick={() => counter.inc()}>inc</button>
    <button type="button" onClick={() => counter.dec()}>dec</button>
    <button type="button" onClick={() => counter.incBy(2)}>inc by 2</button>
    <button type="button" onClick={() => counter.rename('rush', 'wusaby')}>chnage name</button>
  </div>
}

function Name() {
  const store = useSnapshot(counter)

  return <h2>{store.full_name}</h2>
}

function Count() {
  const store = useSnapshot(counter)

  return <span>{store.doubleCount}</span>
}

createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <Name />
    <Count />
    <Actions />
  </React.StrictMode>
);
