// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    preference: 'dark'
  },

  compatibilityDate: '2024-12-01',

  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@pinia/nuxt', '@nuxt/ui'],

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
  }
})