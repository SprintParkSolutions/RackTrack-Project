import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const vitePrerender = require('vite-plugin-prerender')
const { PuppeteerRenderer } = vitePrerender

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: [
        '/',
        '/solutions',
        '/use-cases',
        '/why-racktrack',
        '/trust-security',
        '/resources',
        '/about-us',
        '/contact-us',
      ],
      renderer: new PuppeteerRenderer({
        maxConcurrentRoutes: 1,
        headless: true,
        renderAfterTime: 2500,
      }),
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
