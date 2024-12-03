// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    preference: 'dark'
  },

  compatibilityDate: '2024-12-01',
  
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@sentry/nuxt/module'
  ],

  router: {
    options: {
      hashMode: true
    }
  },

  ssr: false,

  telemetry: {
    enabled: false
  },

  typescript: {
    typeCheck: true
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT
    }
  },

  sourcemap: {
    client: 'hidden'
  }
})