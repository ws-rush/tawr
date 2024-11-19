import { defineStore } from "../lib"

export const counterStore = defineStore({
    state() {
      return {
        count: 0,
        first_name: 'john',
        last_name: 'doe'
      }
    },
    getters: {
      doubleCount: (state) => state.count * 2,
      full_name: (state) => `${state.first_name} ${state.last_name}`
    },
    actions: {
      inc() {
        counterStore.count++
      },
      async asyncInc() {
        // rewrite this line to success and fail randomly
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.5) {
              resolve(1)
            } else {
              reject()
            }
          }, 1000)
        })
        counterStore.count++
      },
      dec() {
        counterStore.count--
      },
      incBy(num: number) {
        counterStore.count += num
      },
      decBy(num: number) {
        counterStore.count += num
      },
      rename(first_name: string, last_name: string) {
        counterStore.first_name = first_name
        counterStore.last_name = last_name
      }
    }
  })

export const { inc, asyncInc, dec, incBy, decBy, rename } = counterStore.actions