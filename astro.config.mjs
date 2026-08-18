import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// Hajsoholik.pl — agregator promocji bankowych (SSG, PL-only).
// UI 1:1 z artifactu Hajsoholik-Listing-Promocji-Bankowych.html.
// Hand-rolled robots/llms + @astrojs/sitemap.

export default defineConfig({
  site: 'https://hajsoholik.pl',
  output: 'static',
  trailingSlash: 'never',
  adapter: vercel(),
  server: {
    port: 5183,
    host: '127.0.0.1',
  },
  preview: {
    port: 5183,
    host: '127.0.0.1',
  },
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/promocja/120-zl-za-ankiety-i-testy-revolut-18'),
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date('2026-08-14'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
