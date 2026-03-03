// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
  ],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: "123",
    // Public keys (exposed to client-side)
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8000",
      startYear: Number(process.env.START_YEAR) || 2018,
    },
  },
  i18n: {
    defaultLocale: "id",
    // strategy: "no_prefix", // No route prefixes - same URLs for all languages
    locales: [
      {
        code: "id",
        name: "Indonesia",
        files: ["id/id.json", "id/installments.json"],
      },
      {
        code: "en",
        name: "English",
        files: ["en/en.json", "en/installments.json"],
      },
    ],
    // langDir: "locales", // Directory where locale files are stored
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   cookieKey: "i18n_redirected",
    //   redirectOn: "root", // Only redirect on root path
    //   alwaysRedirect: false,
    //   fallbackLocale: "id",
    // },
  },
});
