import { defineStore } from "pinia";
import type { ExpenseCategory } from "~~/types/expenses";

export const useExpensesStore = defineStore("expenses", {
    state: () => ({
        categories: [] as ExpenseCategory[],
        categoriesLoaded: false,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        allCategories: (state) => state.categories,
        categoryOptions: (state) =>
            state.categories.map((c) => ({
                label: c.name,
                value: c.id,
            })),
    },

    actions: {
        async fetchCategories(force = false) {
            if (this.categoriesLoaded && !force) {
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const response = await $fetch<ExpenseCategory[]>("/api/expenses/categories");
                this.categories = response;
                this.categoriesLoaded = true;
            } catch (error: any) {
                console.error("Error fetching categories:", error);
                this.error = error.message || "Failed to fetch categories";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        clearCategories() {
            this.categories = [];
            this.categoriesLoaded = false;
            this.error = null;
        },
    },
});
