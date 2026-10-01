# Stan audytu — Hajsoholik.pl

## Snapshot 2026-10-01

| Pole | Wartość |
|---|---|
| Produkt | `hajsoholik` (web, PL-only) |
| Repo | `~/apps/hajsoholik` |
| Stack | Astro 5 SSG + React 19 islands + Tailwind v4 + lucide-react |
| Build | `pnpm build` (astro build) → 51 stron |
| Deploy | Vercel, projekt `prj_e6VvUqUjjmwhzSOWDZgbz3UAP1rC`, team `team_vS6e6G8rCV46J6vLR6Kqh077` |
| Domena | `hajsoholik.pl` (+ www alias) |
| Produkcja | `dpl_ArzCuuSjGuhe5uMHBUrXMDH3YECA` (05.09 14:23, 247 plików) — **promowany 2026-10-01** |
| Ostatni commit | `d554701` (krypto) |
| Staging | brak |
| Analityka | GA4 (googletagmanager + google-analytics w CSP) |
| Monetyzacja | linki afiliacyjne (banki + krypto), AdSense: brak na stronie |
| Treść | hand-rolled `src/data/*.ts` (brak CMS) |

## Indeksacja — zmierzone

| Zasób | Status |
|---|---|
| `/robots.txt` | 200 — AI crawlers allow, CCBot disallow, sitemap na **www** |
| `/sitemap-index.xml` | 200 → `sitemap-0.xml`, lastmod **2026-09-02** |
| `/sitemap.xml` | **404** |
| `/llms.txt` | 200 |

## Nagłówki — zmierzone

```
content-security-policy: default-src 'self'; ... script-src 'self' 'unsafe-inline' googletagmanager
cross-origin-opener-policy: same-origin-allow-popups
cache-control: public, max-age=0, must-revalidate
```

Brak w odpowiedzi: `strict-transport-security`, `x-content-type-options`,
`referrer-policy`, `permissions-policy` (do weryfikacji w kolejnym passie).

## Historia deployów (kontekst regresji)

- 05.09 14:23 — `dpl_ArzCuuSjGuhe5uMHBUrXMDH3YECA`, 247 plików (najbogatsza wersja; obecna produkcja)
- 05.09 17:33 — spadek do 66 plików (−159)
- 12.09 14:45 — `dpl_Gtc9LgDgJm1Dmj8MzcKBVnsCZ3gW` (źródło odzyskania krypto)
- 15.09 — pierwszy bez krypto w repo
- 30.09 12:40 — `dpl_BWJV1Zxsyo9gbRuV4ZpjWQGbxrfm` (ostatni przed promocją)

## Znane ryzyka (do weryfikacji w passach)

1. Repo ≠ produkcja: repo ma 25 ofert + moje krypto (commit `d554701`), produkcja to deploy 05.09
2. `app-ads.txt` w repo (30.09) — czy jest w deployu 05.09?
3. `sitemap` wskazuje `www`, strona serwuje bez `www` — do sprawdzenia canonical

---

## Aktualizacja 2026-10-01 (iteracja 1)

| Pole | Stan |
|---|---|
| Produkcja | `hajsoholik-hfq8s035p-…vercel.app` → alias `hajsoholik.pl` |
| Build | `pnpm build` → 51 stron; `astro check` → 0 errors |
| SEO-001 | `priceValidUntil` w przeszłości: **23/36 → 0/36** (naprawione) |
| SEO-002 | `aggregateRating` (self-serving): **37 → 0** stron (naprawione) |
| Performance/CWV | **UNVERIFIED** — Lighthouse pada `INVALID_URL`, Chromium działa |

### Pułapki zmierzone w tej iteracji (objaw → przyczyna → fix)

1. **Wszystkie `curl` zwracają `000`, pliki 0 B, Python `SSL handshake timeout`**
   → chwilowy zanik łącza sieciowego na maszynie, **nie** awaria produkcji.
   → Fix: ponowić z retry (3×, odstęp 5 s) i **nigdy** nie raportować `000` jako 404/awarii.
   Sonda, która padła w całości, unieważnia pomiar — dokładnie pułapka z SKILL.md.

2. **`npx lighthouse` → `LighthouseError: INVALID_URL` mimo poprawnego URL-a**
   → nie jest to zły URL ani brak Chrome: `--dump-dom` zwraca HTML poprawnie,
   a błąd leci z `UrlUtils.normalizeUrl` w obu wersjach (13.5.0 i 12.8.2),
   także bez `--quiet`, bez `--output-path`, z `CHROME_PATH` i bez `NODE_COMPILE_CACHE`.
   → Fix: **nie mierzyć CWV tym narzędziem w tym środowisku**; instalacja toolchainu
   jest zakazana, więc CWV zostają `UNVERIFIED` i idą do backlogu jako `BLOKADA`.
   Nie zastępować pomiaru domysłem.

3. **`priceValidUntil` = `deadlineDate`** → jedno pole pełniło dwie role (termin promocji
   i ważność ceny), więc po terminie schema kłamała o wygasłej ofercie.
   → Fix: pole publikowane tylko gdy data ≥ dzień builda. Znaczenie pola wygrywa z chęcią
   posiadania rich result.

4. **`aggregateRating` z `ratingCount: 1`** → deterministyczna ocena redakcji sprzedana
   jako agregat opinii użytkowników (self-serving review).
   → Fix: usunięte `aggregateRating`, zostaje jawny `Review` ekspercki.
   Sprawdzaj, **co pole znaczy**, nie tylko czy się waliduje.
