module.exports = {
  target: 'server',
  telemetry: false,

  head: {
    title: 'test-sibdev-2',
    htmlAttrs: { lang: 'ru' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap' },
    ]
  },

  server: {
    port: process.env.PORT || 3000
  },

  css: [
    'element-ui/lib/theme-chalk/index.css',
    './static/global.css',
    'normalize.css/normalize.css',
  ],

  plugins: [
    '@/plugins/element-ui',
    { src: '@/plugins/local-storage', ssr: false },
  ],

  buildModules: [],

  modules: [
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000/',
  },

  build: {
    transpile: [/^element-ui/],
  }
}
