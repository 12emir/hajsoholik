import { CRYPTO_LOGO_URLS } from './crypto-affiliates'
import {
  type LeadstarPromoEnrichment,
  PROMO_LEADSTAR_ENRICHMENT,
} from './leadstar-catalog.generated'
import type { Promotion } from './promotions'

/** Dane Leadstar (highlights, kroki, logo) dla promocji Hajsoholik. */
export function leadstarEnrichment(promoId: number): LeadstarPromoEnrichment | undefined {
  return PROMO_LEADSTAR_ENRICHMENT[promoId]
}

/** Bullet highlights — Leadstar description, fallback na tagi redakcji. */
export function displayHighlights(promo: Pick<Promotion, 'id' | 'tags'>): string[] {
  const fromLeadstar = leadstarEnrichment(promo.id)?.highlights ?? []
  if (fromLeadstar.length > 0) return fromLeadstar.slice(0, 4)
  return promo.tags.slice(0, 4)
}

/** Kroki do premii — Leadstar benefits, fallback na skrót redakcji. */
export function displayRequirements(promo: Pick<Promotion, 'id' | 'requirements'>): string[] {
  const fromLeadstar = leadstarEnrichment(promo.id)?.steps ?? []
  if (fromLeadstar.length > 0) return fromLeadstar
  return promo.requirements
}

/** Logo: Leadstar CDN albo lokalne `public/partners` dla krypto. */
export function displayLogoUrl(promoId: number): string | undefined {
  return leadstarEnrichment(promoId)?.logoUrl ?? CRYPTO_LOGO_URLS[promoId]
}
