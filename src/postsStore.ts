import { defineStore } from "../lib";

export const postsStore = defineStore({
  state() {
    return {
      userId: null,
    };
  },
  getters(state) {
    return {
      posts: (get) => {
        const userId = get(state).userId;
        return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId ? userId : 1}`)
        .then((response) => response.json())
      },
    };
  },
  actions: {
    setUserId(userId) {
      this.userId = userId;
    },
  },
});
