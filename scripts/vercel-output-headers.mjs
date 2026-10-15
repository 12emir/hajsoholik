// Patch .vercel/output/config.json: nagłówki z vercel.json jako ROUTES z continue:true.
// Dlaczego tak: `vercel deploy --prebuilt` nie aplikuje `headers` z vercel.json
// (produkcja 2026-10-15), a config.json w Build Output API v3 nie ma kluczu `headers`
// — nagłówki definiuje się wyłącznie jako reguły routes z continue:true
// (ten sam wzorzec, którego używa sam adapter dla /_astro).
import fs from 'node:fs'

const configPath = '.vercel/output/config.json'
if (!fs.existsSync(configPath)) {
  console.log('[headers] brak config.json — pomijam')
  process.exit(0)
}

// Wzorce w routes to regexy (nie path-to-regexp jak w vercel.json).
const HEADER_ROUTES = [
  {
    src: '^/(.*)$',
    headers: {
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'SAMEORIGIN',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      'cross-origin-opener-policy': 'same-origin',
    },
    continue: true,
  },
  {
    src: '^/(sitemap[a-z0-9.-]*\\.xml|robots\\.txt|llms\\.txt)$',
    headers: { 'cache-control': 'public, s-maxage=3600, max-age=0, must-revalidate' },
    continue: true,
  },
  {
    src: '^/og/(.*)$',
    headers: { 'cache-control': 'public, max-age=604800' },
    continue: true,
  },
]

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
// Idempotentnie: usuń poprzednie wstawki (poznają się po x-content-type-options), potem dodaj na czoło.
const prev = (config.routes || []).filter(
  (r) => !r.headers || !('x-content-type-options' in (r.headers || {})),
)
config.routes = [...HEADER_ROUTES, ...prev]
fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
console.log(`[headers] wstawiono ${HEADER_ROUTES.length} reguł nagłówków na czoło routes (${prev.length} istniejących zachowanych)`)
