import { defineStore } from "pinia";
import type { UpdateUserRequest, User } from "~~/types/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    isInitialized: false,
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
    isAdmin: (state) => state.user?.roleId === "administrator",
    isMember: (state) => state.user?.roleId === "member",
    isSuperadministrator: (state) =>
      state.user?.roleId === "superadministrator",
    userRole: (state) => state.user?.roleId || null,
  },

  actions: {
    async fetchUser() {
      try {
        const headers = import.meta.server
          ? useRequestHeaders(["cookie"])
          : undefined;
        const user = await $fetch<User>("/api/users/me", { headers });
        this.user = user;
      } catch (error) {
        this.clearUser();
        throw error;
      } finally {
        this.isInitialized = true;
      }
    },
    async updateUser(data: UpdateUserRequest) {
      const headers = import.meta.server
        ? useRequestHeaders(["cookie"])
        : undefined;
      const updatedUser = await $fetch<User>("/api/users/me", {
        method: "PATCH",
        body: data,
        headers,
      });
      this.user = updatedUser;
      return updatedUser;
    },
    clearUser() {
      this.user = null;
      this.isInitialized = true;
    },
  },
});
