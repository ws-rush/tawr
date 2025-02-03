import { defineStore } from "tawr-state";

export const [usePostsStore, postsStore] = defineStore({
  state: () => ({
    userId: 0,
  }),
  getters: {
    posts: (store): Promise<{id: number, title: string}[]> => {
      const userId = store.userId;
      return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId ? userId : 1}`)
        .then((response) => response.json());
    },
  },
  actions: {
    setUserId(userId: number) {
      this.userId = userId;
    },
  },
});