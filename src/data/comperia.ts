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

/**
 * RRSO obliczone z danych oferty: kwota z linku (kg: 10 000 zł), okres n = (kwota+koszt)/rata,
 * IRR miesięczny z kredytu równoratowego, RRSO = (1+i)^12 − 1. Null, gdy danych brak.
 */
export function computeRrso(offer: ComperiaOffer): number | null {
  const kwota = Number(offer.link.match(/kwota_kredytu_=(\d+)/)?.[1])
  const rata = Number(offer.rata)
  const koszt = Number(offer.koszt_calkowity)
  if (!Number.isFinite(kwota) || !Number.isFinite(rata) || rata <= 0 || !Number.isFinite(koszt)) return null
  const n = Math.round((kwota + koszt) / rata)
  if (n < 1) return null
  let lo = 0
  let hi = 1
  for (let k = 0; k < 100; k++) {
    const mid = (lo + hi) / 2
    const pv = (rata * (1 - (1 + mid) ** -n)) / mid
    if (pv > kwota) lo = mid
    else hi = mid
  }
  return ((1 + (lo + hi) / 2) ** 12 - 1) * 100
}
