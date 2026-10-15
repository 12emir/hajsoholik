import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { site } from './src/data/site'

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
  // Stare adresy ofert, które zmieniły slug — 301 zamiast 404 (SEO-210).
  redirects: {
    '/promocja/binance-bonus-powitalny-za-rejestracje-i-depozyt':
      '/promocja/binance-bonus-powitalny-learn-earn',
    // Bing/Yahoo i stare narzędzia pytają o /sitemap.xml; indeks @astrojs/sitemap
    // mieszka pod /sitemap-index.xml.
    '/sitemap.xml': '/sitemap-index.xml',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/promocja/120-zl-za-ankiety-i-testy-revolut-18'),
      changefreq: 'daily',
      priority: 0.7,
      // Data realnej zmiany treści (najpóźniejsza weryfikacja oferty u źródła),
      // a nie data builda — stała 2026-08-14 kłamała dla stron z października (SEO-204).
      lastmod: new Date(`${site.updatedAt}T12:00:00+02:00`),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
