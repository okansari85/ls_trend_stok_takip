import { fileURLToPath } from 'node:url'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  ssr: false,

  // nuxt-auth-sanctum options (also configurable via environment variables)
  app: {
    baseURL: '/lstrend/',

    // '/lstrend/',
    head: {
      titleTemplate: '%s - Stok Takip V.01',
      title: 'LS TREND',

      link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      }],
    },
  },

  devtools: {
    enabled: true,
  },

  css: [
    '@core/scss/template/index.scss',
    '@styles/styles.scss',
    '@/plugins/iconify/icons.css',
    '@layouts/styles/index.scss',
    'vue-toast-notification/dist/theme-default.css',
  ],

  components: {
    dirs: [{
      path: '@/@core/components',
      pathPrefix: false,
    }, {
      path: '~/components/global',
      global: true,
    }, {
      path: '~/components',
      pathPrefix: false,
    }],
  },

  plugins: [
    '@/plugins/vuetify/index.ts',
    '@/plugins/iconify/index.ts',
    '@/plugins/sweetalert2.ts',
  ],

  imports: {
    dirs: ['./@core/utils', './@core/composable/', './plugins/*/composables/*'],
    presets: [],
  },

  hooks: {},

  experimental: {
    typedPages: true,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@/*': ['../*'],
          '@layouts/*': ['../@layouts/*'],
          '@layouts': ['../@layouts'],
          '@core/*': ['../@core/*'],
          '@core': ['../@core'],
          '@images/*': ['../assets/images/*'],
          '@styles/*': ['../styles/*'],
        },
      },
    },
  },

  // ℹ️ Disable source maps until this is resolved: https://github.com/vuetifyjs/vuetify-loader/issues/290
  sourcemap: {
    server: false,
    client: false,
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'swiper-container' || tag === 'swiper-slide',
    },
  },

  vite: {

    define: { 'process.env': {} },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
        '@core': fileURLToPath(new URL('./@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./@layouts', import.meta.url)),
        '@images': fileURLToPath(new URL('./assets/images/', import.meta.url)),
        '@styles': fileURLToPath(new URL('./assets/styles/', import.meta.url)),
        '@configured-variables': fileURLToPath(new URL('./assets/styles/variables/_template.scss', import.meta.url)),
      },

    },

    build: {
      chunkSizeWarningLimit: 5000,
    },

    optimizeDeps: {
      exclude: ['vuetify'],
      entries: [
        './**/*.vue',
      ],
    },

    vue: {
      script: {
        defineModel: true,
        propsDestructure: false,
      },
    },

    plugins: [
      svgLoader(),
      vuetify({
        styles: {
          configFile: 'assets/styles/variables/_vuetify.scss',
        },
      }),
      null,
    ],
  },

  build: {
    transpile: ['vuetify'],
  },

  modules: ['@vueuse/nuxt', '@nuxtjs/device', '@pinia/nuxt', 'nuxt-auth-sanctum'],

  pinia: {
    storesDirs: ['./stores/**'],
  },
  sanctum: {
    mode: 'cookie',
    baseUrl: 'https://sarielektronik.com/api/public',

    // 'https://sarielektronik.com/api/public',
    csrf: {
      cookie: 'XSRF-TOKEN',
      header: 'X-XSRF-TOKEN',
    },
    redirect: {
      onAuthOnly: '/login',
      onGuestOnly: '/dashboard',
    },
    globalMiddleware: {
      enabled: true,
    },
  },

})
