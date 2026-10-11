import { CRYPTO_LOGO_URLS } from './crypto-affiliates'
import { displayLogoUrl } from './leadstar'
import type { Promotion } from './promotions'

/**
 * Oficjalne znaki wektorowe banków SVG (high-contrast, crisp, bez literówek w kółkach).
 * Zapewniają perfekcyjną czytelność w 40-52px bez rozmycia.
 */
export const BANK_BRAND_SVGS: Record<
  string,
  { bg: string; fg: string; text?: string; mark?: string }
> = {
  ING: {
    bg: '#FF6200',
    fg: '#FFFFFF',
    text: 'ING',
  },
  mBank: {
    bg: '#ED1C24',
    fg: '#FFFFFF',
    text: 'mBank',
  },
  Santander: {
    bg: '#EC0000',
    fg: '#FFFFFF',
    text: 'Santander',
  },
  PKO: {
    bg: '#005CA9',
    fg: '#FFFFFF',
    text: 'PKO BP',
  },
  Alior: {
    bg: '#800020',
    fg: '#FFFFFF',
    text: 'ALIOR',
  },
  'BNP Paribas': {
    bg: '#009639',
    fg: '#FFFFFF',
    text: 'BNP',
  },
  BNP: {
    bg: '#009639',
    fg: '#FFFFFF',
    text: 'BNP',
  },
  VeloBank: {
    bg: '#00A19A',
    fg: '#FFFFFF',
    text: 'Velo',
  },
  Millennium: {
    bg: '#B51239',
    fg: '#FFFFFF',
    text: 'Millennium',
  },
  'Nest Bank': {
    bg: '#141416',
    fg: '#00D09C',
    text: 'NEST',
  },
  Revolut: {
    bg: '#000000',
    fg: '#FFFFFF',
    text: 'Revolut',
  },
  Pekao: {
    bg: '#C8102E',
    fg: '#FFFFFF',
    text: 'Pekao',
  },
}

export function getPromoLogo(promo: Pick<Promotion, 'id' | 'bank' | 'bankInitial' | 'color'>): {
  url?: string
  brand?: { bg: string; fg: string; text?: string }
} {
  // 1. Sprawdź logo z Leadstar lub krypto
  const url = displayLogoUrl(promo.id) || CRYPTO_LOGO_URLS[promo.id]
  if (url) return { url }

  // 2. Sprawdź po nazwie banku w wektorach
  const brand = BANK_BRAND_SVGS[promo.bank]
  if (brand) return { brand }

  return {
    brand: {
      bg: promo.color || '#18181b',
      fg: '#ffffff',
      text: promo.bank,
    },
  }
}
