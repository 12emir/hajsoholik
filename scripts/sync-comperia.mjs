import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'comperia-catalog.generated.json')

// COM-001: klucz wyłącznie z env (.env.local) — repo jest publiczne, zakaz hardcodowania.
const API_KEY = process.env.COMPERIA_API_KEY
const HOST = process.env.COMPERIA_HOST || 'zordon.leadkredyt.pl'
const API_URL = 'https://www.comperialead.pl/apicl/'

const CATEGORIES = {
  kg: { name: 'Kredyt gotówkowy', slug: 'kredyty-gotowkowe' },
  kh: { name: 'Kredyt hipoteczny', slug: 'kredyty-hipoteczne' },
  ph: { name: 'Pożyczka hipoteczna', slug: 'pozyczki-hipoteczne' },
  ks: { name: 'Kredyt samochodowy', slug: 'kredyty-samochodowe' },
  kk: { name: 'Karta kredytowa', slug: 'karty-kredytowe' },
  lb: { name: 'Lokata bankowa', slug: 'lokaty-bankowe' },
  ko: { name: 'Konto osobiste', slug: 'konta-osobiste' },
  kosz: { name: 'Konto oszczędnościowe', slug: 'konta-oszczednosciowe' },
  lis: { name: 'Leasing', slug: 'leasing' },
  chw: { name: 'Szybka gotówka', slug: 'chwilowki' },
  pzb: { name: 'Produkty pozabankowe', slug: 'pozyczki-pozabankowe' },
}

async function fetchCategoryOffers(categoryCode) {
  const allOffers = []
  let page = 1

  while (page <= 10) {
    const params = new URLSearchParams({
      api: API_KEY,
      host: HOST,
      format: 'json',
      polecenie: 'wyniki',
      produkt: categoryCode,
      ilosc: '100',
      strona: String(page),
    })

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Hajsoholik/1.0 (+https://hajsoholik.pl)',
        },
        body: params.toString(),
      })

      if (!resp.ok) {
        console.warn(`[comperia] HTTP ${resp.status} for ${categoryCode} page ${page}`)
        break
      }

      const data = await resp.json()
      if (data && data.odpowiedz && Array.isArray(data.odpowiedz.oferty)) {
        const offers = data.odpowiedz.oferty
        if (offers.length === 0) break

        const existingIds = new Set(allOffers.map((o) => o.id_oferty))
        const newOnes = offers.filter((o) => !existingIds.has(o.id_oferty))
        if (newOnes.length === 0) break

        allOffers.push(...newOnes)
        if (offers.length < 100) break
        page++
      } else {
        break
      }
    } catch (err) {
      console.error(`[comperia] Error fetching ${categoryCode} page ${page}:`, err.message)
      break
    }
  }

  return allOffers
}

async function main() {
  if (!API_KEY) {
    console.warn('[comperia] Brak COMPERIA_API_KEY w env — pomijam synchronizację, build użyje katalogu z cache.')
    return
  }
  console.log(`[comperia] Rozpoczynam synchronizację z API ComperiaLead (${HOST})...`)

  // Wczytaj poprzedni katalog jako fallback w razie problemów z siecią/API
  let existingCatalog = null
  try {
    const raw = await fs.readFile(OUTPUT_FILE, 'utf-8')
    existingCatalog = JSON.parse(raw)
  } catch {
    // Pierwsze uruchomienie
  }

  const result = {
    syncedAt: new Date().toISOString(),
    host: HOST,
    categories: {},
  }

  let totalOffersFetched = 0

  for (const [code, meta] of Object.entries(CATEGORIES)) {
    try {
      const offers = await fetchCategoryOffers(code)
      if (offers.length > 0) {
        totalOffersFetched += offers.length
        result.categories[code] = {
          code,
          name: meta.name,
          slug: meta.slug,
          count: offers.length,
          offers,
        }
        console.log(`[comperia] ✓ ${code.toUpperCase()} (${meta.name}): ${offers.length} ofert`)
      } else if (existingCatalog?.categories?.[code]) {
        console.warn(`[comperia] ⚠️ Brak ofert dla ${code}, używam istniejącego cache`)
        result.categories[code] = existingCatalog.categories[code]
      } else {
        result.categories[code] = {
          code,
          name: meta.name,
          slug: meta.slug,
          count: 0,
          offers: [],
        }
      }
    } catch (err) {
      console.error(`[comperia] Błąd pobierania ${code}:`, err.message)
      if (existingCatalog?.categories?.[code]) {
        result.categories[code] = existingCatalog.categories[code]
      }
    }
  }

  // Zabezpieczenie przed nadpisaniem pustym katalogiem
  if (totalOffersFetched === 0 && existingCatalog) {
    console.warn('[comperia] ⚠️ API nie zwróciło żadnych ofert! Zachowuję poprzedni stan katalogu.')
    return
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8')
  console.log(`[comperia] Zapisano katalog (${totalOffersFetched} ofert) do ${OUTPUT_FILE}`)
}

main().catch((err) => {
  console.error('[comperia] Błąd krytyczny:', err)
  // Nie przerywaj procesu buildu całego serwisu jeśli plik już istnieje
  process.exit(0)
})
