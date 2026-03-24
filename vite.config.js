import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'
import terser from '@rollup/plugin-terser'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'تقسيم القطه | Qattah App',
        short_name: 'تقسيم القطه',
        description: 'تطبيق تقسيم القطّة - حساب المصاريف والمشاركة بين الأفراد بسهولة وبطريقة عادلة',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        id: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: '/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        categories: ['finance', 'productivity', 'utilities'],
        lang: 'ar',
        dir: 'rtl'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    terser()
  ],
  // Add allowed hosts for security
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://192.168.1.9:3000',
        'http://192.168.1.9:3001',
        'http://qattah.fhidan.com',
        'https://qattah.fhidan.com',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    hmr: {
      host: 'qattah.fhidan.com',
      protocol: 'ws',
    },
  },
  preview: {
    host: 'qattah.fhidan.com',
    port: 3000,
    allowedHosts: [
      'localhost',
      '192.168.1.9',
      'qattah.fhidan.com',
      '*.fhidan.com',
      '.fhidan.com',
    ],
  },
  build: {
    target: 'es2022',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-ui'
            }
            return 'vendor-other'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000
  },
  // Add CSP and security headers
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; frame-ancestors 'self' https://qattah.fhidan.com https://*.fhidan.com;",
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
  },
  // Define global environment variables
  define: {
    'import.meta.env.VITE_ALLOWED_HOSTS': JSON.stringify([
      'localhost',
      '192.168.1.9',
      'qattah.fhidan.com',
      '*.fhidan.com',
      '.fhidan.com',
    ]),
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/setup.js',
        '**/*.config.js',
        '**/*.config.ts'
      ]
    }
  }
})