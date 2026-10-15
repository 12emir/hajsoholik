import catalog from './comperia-catalog.generated.json'

export interface ComperiaOffer {
  id_oferty: string
  bank: string
  oferta: string
  link: string
  logotyp: string
  szczegoly?: string
  [key: string]: unknown
}

export interface ComperiaCategory {
  code: string
  name: string
  slug: string
  count: number
  offers: ComperiaOffer[]
}

export function getComperiaCategory(code: string): ComperiaCategory {
  const cat = (catalog.categories as Record<string, ComperiaCategory>)[code]
  if (!cat) {
    return { code, name: code, slug: code, count: 0, offers: [] }
  }
  return cat
}

/** Data ostatniej synchronizacji katalogu (YYYY-MM-DD…) — do wyświetlenia „dane z…”. */
export function getComperiaSyncedAt(): string | null {
  return (catalog as { syncedAt?: string }).syncedAt ?? null
}
