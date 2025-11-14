import { defineStore } from "pinia";
import type { User } from "~~/types/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
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
      }
    },
    clearUser() {
      this.user = null;
    },
  },
});
