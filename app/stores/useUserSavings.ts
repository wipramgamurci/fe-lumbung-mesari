import { defineStore } from "pinia";
import type { UserMeSavingsResponse } from "~~/server/api/users/me/savings.get";

function defaultYear(): number {
  return new Date().getFullYear();
}

export const useUserSavingsStore = defineStore("userSavings", {
  state: () => ({
    /** Cached responses keyed by `response.year` from the API */
    savingsByYear: {} as Record<number, UserMeSavingsResponse>,
    /** Year of the payload exposed as `savings` (last successful fetch or cache hit) */
    lastFetchedYear: null as number | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    savings(state): UserMeSavingsResponse | null {
      if (state.lastFetchedYear === null) return null;
      return state.savingsByYear[state.lastFetchedYear] ?? null;
    },

    savingsForYear:
      (state) =>
      (year: number): UserMeSavingsResponse | null =>
        state.savingsByYear[year] ?? null,
  },

  actions: {
    async fetchSavings(year?: number, force = false) {
      const targetYear = year ?? defaultYear();

      if (!force && this.savingsByYear[targetYear]) {
        this.lastFetchedYear = targetYear;
        this.error = null;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<UserMeSavingsResponse>(
          "/api/users/me/savings",
          year !== undefined ? { query: { year } } : {},
        );
        this.savingsByYear[response.year] = response;
        this.lastFetchedYear = response.year;
      } catch (error: any) {
        this.error =
          error.data?.message ||
          error.message ||
          "Failed to fetch user savings";
        console.error("Error fetching user savings:", error);
      } finally {
        this.loading = false;
      }
    },

    clearSavings() {
      this.savingsByYear = {};
      this.lastFetchedYear = null;
      this.error = null;
    },

    clearSavingsYear(year: number) {
      delete this.savingsByYear[year];
      if (this.lastFetchedYear === year) {
        this.lastFetchedYear = null;
      }
    },
  },
});
