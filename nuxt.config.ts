import { execSync } from "child_process";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    preference: "dark",
  },

  compatibilityDate: "2024-12-01",

  devtools: { enabled: process.env.NODE_ENV === "development" },

  eslint: {
    checker: true,
  },

  modules: ["@nuxt/eslint", "@pinia/nuxt", "@nuxt/ui", "@sentry/nuxt/module"],

  router: {
    options: {
      hashMode: true,
    },
  },

  runtimeConfig: {
    public: {
      sentry: {
        dsn: process.env.SENTRY_DSN,
        release: execSync("git rev-parse HEAD").toString().trim(),
      },
    },
  },

  ssr: false,

  telemetry: {
    enabled: false,
  },

  typescript: {
    typeCheck: true,
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    },
  },

  spaLoadingTemplate: "spa-loading-template.html",

  sourcemap: {
    client: "hidden",
  },
});
