import { defineStore } from "pinia";
import type {
  CashbookBalancesResponse,
  CashbookTransaction,
  CashbookTransactionsResponse,
} from "~~/types/cashbook";

const DASHBOARD_TTL_MS = 15 * 60 * 1000;

export const useCashbookStore = defineStore("cashbook", {
  state: () => ({
    balances: null as CashbookBalancesResponse | null,
    recentTransactions: [] as CashbookTransaction[],
    isLoaded: false,
    loadingBalances: false,
    loadingTransactions: false,
    errorBalances: null as string | null,
    errorTransactions: null as string | null,
    lastFetchedAt: null as number | null,
  }),

  getters: {
    isStale: (state): boolean => {
      if (!state.lastFetchedAt) return true;
      return Date.now() - state.lastFetchedAt >= DASHBOARD_TTL_MS;
    },
  },

  actions: {
    async fetchBalances() {
      this.loadingBalances = true;
      this.errorBalances = null;

      try {
        const response = await $fetch<CashbookBalancesResponse>(
          "/api/cashbook/balances",
        );
        this.balances = response;
      } catch (error: any) {
        this.errorBalances =
          error.data?.message || error.message || "Failed to fetch balances";
        throw error;
      } finally {
        this.loadingBalances = false;
      }
    },

    async fetchRecentTransactions() {
      this.loadingTransactions = true;
      this.errorTransactions = null;

      try {
        const response = await $fetch<CashbookTransactionsResponse>(
          "/api/cashbook/transactions",
          { query: { page: 1, limit: 10 } },
        );
        this.recentTransactions = response.data;
      } catch (error: any) {
        this.errorTransactions =
          error.data?.message || error.message || "Failed to fetch transactions";
        throw error;
      } finally {
        this.loadingTransactions = false;
      }
    },

    async fetchDashboardData(force = false) {
      if (
        !force &&
        this.isLoaded &&
        this.lastFetchedAt &&
        Date.now() - this.lastFetchedAt < DASHBOARD_TTL_MS
      ) {
        return;
      }

      await Promise.all([this.fetchBalances(), this.fetchRecentTransactions()]);
      this.lastFetchedAt = Date.now();
      this.isLoaded = true;
    },
  },
});
