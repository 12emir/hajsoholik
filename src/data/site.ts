/** Site config — single source of truth for SEO metadata (Hajsoholik.pl). */
import { PROMOTIONS } from './promotions'

/** Najpóźniejsza weryfikacja oferty u źródła — jedno źródło prawdy o świeżości serwisu. */
const latestVerification = PROMOTIONS.map((promo) => promo.verifiedAt)
  .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
  .sort()
  .at(-1)

export const site = {
  name: 'Hajsoholik',
  url: 'https://hajsoholik.pl',
  title: 'Hajsoholik — promocje bankowe 2026: premie za konto, karty, lokaty',
  description:
    'Promocje bankowe 2026: premie za konto (do 4200 zł), karty, lokaty i cashback. Porównaj bonusy, warunki i ROI — wybierz najszybszy zarobek.',
  language: 'pl',
  locale: 'pl_PL',
  twitter: '@hajsoholik',
  ogImage: '/og-default.png',
  /** GA4 — ładowany wyłącznie po zgodzie (Consent Mode v2, patrz components/Analytics.astro). */
  gaId: 'G-9M4RZG70M2',
  /** Wydawca — podmiot odpowiedzialny za treść (E-E-A-T, schema `publisher`). */
  publisher: 'Zordon Intelligence sp. z o.o.',
  publishedAt: '2026-08-11',
  /**
   * Data ostatniej zmiany treści = najpóźniejsza weryfikacja oferty u źródła.
   * Wcześniej ręczna stała rozjeżdżała się z `verifiedAt` w danych (SEO-204):
   * sitemap ogłaszał `lastmod` z 2026-08-14 dla stron zmienionych w październiku.
   */
  updatedAt: latestVerification ?? '2026-10-11',
  /**
   * Data builda — „stan na", z którego liczymy statusy ofert po stronie serwera.
   * Wyspa dostaje ją jako prop, żeby pierwszy render klienta był identyczny z SSR
   * (brak hydration mismatch), a prawdziwy stan dolicza po zamontowaniu.
   */
  buildDate: new Date().toISOString().slice(0, 10),
} as const
