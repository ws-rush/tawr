import { defineStore } from "tawr-state";

export const postsStore = defineStore({
  state: () => ({
    userId: 0,
  }),
  getters: {
    getMainList: (state) => {
      const id = state.userId
      return id
    }
  },
  queries: {
    posts: (store) => ({
      fn: () => {
        const userId = store.userId;
        return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId ? userId : 1}`)
          .then((response) => response.json());
      }
    }),
    randoms: () => ({
      fn: () => {
        const data = { nested: { values: { inothers: { give: Math.random() } } } };
        console.log('randoms', data);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
          }, 2000);
        });
      }
    })
  },
  actions: {
    setUserId(userId: number) {
      this.userId = userId;
    },
    regenerate() {
      this.$invalidate(['randoms'])
    }
  },
})