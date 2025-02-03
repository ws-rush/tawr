import { defineStore } from "tawr-state"

export const [useCounterStore, counterStore] = defineStore({
  getters: {
    doubleCount: (store) => store.count * 2,
    quadroCount: (store) => store.doubleCount * 2,
    full_name: (store) => `${store.first_name} ${store.last_name}`
  },
  actions: {
    inc() {
      this.count++
    },
    async asyncInc() {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve(1)
          } else {
            reject()
          }
        }, 1000)
      })
      this.count++
    },
    dec() {
      this.count--
    },
    incBy(num: number) {
      this.count += num
    },
    decBy(num: number) {
      this.count -= num // Fixed the bug: was += instead of -=
    },
    rename(first_name: string, last_name: string) {
      this.first_name = first_name
      this.last_name = last_name
    }
  },
  state: () => ({
    count: 0,
    first_name: 'john',
    last_name: 'doe',
    nested: { value: 1 }
  }),
})