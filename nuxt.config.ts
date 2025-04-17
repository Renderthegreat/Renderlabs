// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxtjs/mdc'],
  mdc: {
    components: {
      map: {
        ProbeScript: 'ProbeScript'
      }
    }
  },
  ui: {

  },
  components: true,
  css: ['@/assets/css/global.css'],
})
