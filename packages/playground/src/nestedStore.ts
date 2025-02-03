import { defineStore } from "tawr-state";

export const [useNestedStore, nestedStore] = defineStore({
    state: () => ({
      user: {
        profile: {
          name: 'John',
          settings: {
            theme: 'light',
            notifications: true
          }
        },
        stats: {
          visits: 0
        }
      }
    }),
    getters: {
      userTheme: (store) => store.user.profile.settings.theme,
      displayName: (store) => `User: ${store.user.profile.name}`
    },
    actions: {
      updateTheme(theme: string) {
        this.user.profile.settings.theme = theme;
      },
      incrementVisits() {
        this.user.stats.visits++;
      }
    }
  });