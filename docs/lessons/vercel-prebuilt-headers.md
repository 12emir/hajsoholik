# Lekcja: `vercel deploy --prebuilt` ignoruje `headers` z vercel.json

**Data:** 2026-10-15 · **Produkt:** hajsoholik · **Domga:** deploy web

## Objaw
Nagłówki zdefiniowane w `vercel.json` (`x-content-type-options`, cache `s-maxage`…) nie
obecne na odpowiedziach produkcji przy deployu `vercel deploy --prebuilt --prod`.
HSTS `max-age=63072000` na odpowiedzi to platformowy default Vercela — myląco wygląda
jak „nasz" nagłówek.

## Przyczyna
CLI przy prebuilt uploaduje gotowy artefakt `.vercel/output` i nie merdżuje `headers`
z vercel.json do deploymentu. Build Output API v3 (`config.json`) nie ma kluczu `headers`
— nagłówki definiuje się wyłącznie jako **routes z `continue: true`** (identycznie robi
to adapter `@astrojs/vercel` dla `/_astro`).

## Rozwiązanie (wdrożone, zweryfikowane)
Postbuild `scripts/vercel-output-headers.mjs` wpięty w `pnpm build` po `astro build`:
czyta `.vercel/output/config.json`, prepends 3 reguły (`^/(.*)$` security,
`^/(sitemap…|robots.txt|llms.txt)$` cache, `^/og/(.*)$` cache) z `continue: true`,
idempotentnie (usuwa swoje poprzednie wstawki po polu `x-content-type-options`).

## Reguła
W projektach deployowanych `--prebuilt`: **nigdy nie licz na vercel.json headers/redirects**.
Redirects — sprawdzaj w `.vercel/output/config.json` (adapter Astro przenosi `redirects`
z astro.config.mjs → routes 301 ✓). Headers — tylko przez patch config.json.
Weryfikacja po deployu: `curl -sI https://domena/ | grep -i x-content-type-options`.
