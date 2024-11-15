import { defineStore } from "../lib"

export const counterStore = defineStore({
    state() {
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
        this.count++;
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

export const { inc, asyncInc, dec, incBy, decBy, rename } = counterStore.actions