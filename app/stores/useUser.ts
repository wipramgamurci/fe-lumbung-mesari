import { defineStore } from "pinia";
import type { User } from "~~/types/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    isInitialized: false,
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
  },

  actions: {
    async fetchUser() {
      try {
        const user = await $fetch<User>("/api/me");
        this.user = user;
      } catch (error) {
        this.clearUser();
        throw error;
      } finally {
        this.isInitialized = true;
      }
    },
    clearUser() {
      this.user = null;
      this.isInitialized = true;
    },
  },
});
