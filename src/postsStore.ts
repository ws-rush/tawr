import { defineStore } from "../lib";

let cache = new Map();
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const postsStore = defineStore({
  state() {
    return {
      userId: null,
    };
  },
  getters(state) {
    return {
      // posts: (get) => {
      //   const userId = get(state).userId;
      //   return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId ? userId : 1}`)
      //   .then((response) => response.json())
      // },
      // make a cached posts that keep valus if user id is the same return the ready value
      cachedPosts: (get) => {
        const userId = get(state).userId;
        const currentId = userId ? userId : 1;
      
        // Check if we have valid cached data
        if (cache.has(currentId)) {
          const cachedData = cache.get(currentId);
          if (Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
            return cachedData.data;
          }
          // Cache expired, remove it
          cache.delete(currentId);
        }
      
        // Fetch and store in cache
        return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${currentId}`)
          .then((response) => response.json())
          .then((data) => {
            cache.set(currentId, {
              data,
              timestamp: Date.now()
            });
            return data;
          });
      }
    };
  },
  actions: {
    setUserId(userId) {
      this.userId = userId;
    },
  },
});
