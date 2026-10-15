# Zakończone — Hajsoholik.pl

| ID | Co | Data | Dowód weryfikacji |
|---|---|---|---|
| SEO-001 | `priceValidUntil` nie może być datą przeszłą | 2026-10-01 | produkcja: 23/36 → **0/36** przeszłych |
| SEO-002 | usunięty `aggregateRating` (self-serving) | 2026-10-01 | produkcja: 37 → **0** stron; `Review` 37 zachowany |
| CLEAN-001 | martwy kod `NAV_LINKS` + `NAV_ITEMS` (+ link 404) | 2026-10-01 | `grep src/` → 0 odwołań; build 51 stron |

Poprzednie sesje (kontekst): `app-ads.txt` 200, 10/10 linków afiliacyjnych krypto,
footer 14 linków, strona główna bez panelu „Twój postęp", `og-default.png` 1200×630,
restauracja `SiteHeader`/`Footer`/`CookieBanner` po usunięciu `bare`.

## Iteracja 2 — 2026-10-15 (P1–P3, bez deployu)

| ID | Co zostało zrobione | Dowód weryfikacji (lokalny build + pomiar) |
|---|---|---|
| SEO-201 | Status i etykieta oferty liczone w miejscu renderowania (`statusOf`/`deadlineChip`/`deadlineHuman`), usunięty `status`/`deadlineDays` z danych; wygasła oferta zostaje jako archiwum z `availability: Discontinued` i bez `noindex` | `dist/promocja/500-zl-za-ekonto-200-zl-za-polecenie/index.html`: `data-build-status="Archiwalna"`, `availability":"…/Discontinued"`, 0× `noindex`; strona główna: 19 ofert, `ItemList numberOfItems=19` (wygasłej nie ma na liście) |
| SEO-202 | `affiliateAttrs` = `target="_blank" rel="sponsored noopener"` na wszystkich linkach afiliacyjnych (karty, modal, kategoria, strona oferty) | audyt `dist/`: **78** linków ze `sponsored`; 0 domen afiliacyjnych (prostodo.pl, leadstar.pl, kucoin `?rcode=`) bez `sponsored`; pozostałe `rel="noopener"` to wyłącznie banki, uodo.gov.pl i turbopromki.pl |
| SEO-203 | Czas przekazany do wyspy jako `buildNow` (`site.buildDate`) + `useEffect` po hydratacji zamiast `new Date()` w renderze | Lighthouse `errors-in-console` = **1** (brak błędów) na `/` i na stronie oferty — wcześniej React #418 |
| SEO-204 | `astro.config.mjs`: `lastmod: site.updatedAt` zamiast `new Date('2026-08-14')` | `dist/sitemap-0.xml`: 34 URL-e, wszystkie `lastmod 2026-10-11T10:00:00.000Z` (najpóźniejszy `verifiedAt`) |
| SEO-205 | Poprawione `stop-color="##…"` → `"#…"`, zawijanie tytułu do 2 linii, `og:image` = JPEG 1200×630 generowany po buildzie (`scripts/og-jpgs.mjs`, sips) | 20/20 kart: `dist/og/*.jpg` (`sips`: 1200×630, format jpeg, ~80 kB); HTML oferty: `og:image:type=image/jpeg`, `:width=1200`, `:height=630`, `:alt`, `twitter:image:alt` |
| SEO-206 | `llms.txt` przepisany: linki `[tytuł](url)`, sekcje „Informacje" i „Definicje pól", na ofertę ROI/termin/status/weryfikacja, wydawca i zastrzeżenie | `dist/llms.txt`: 19 ofert z linkami markdown, `Wydawca: Zordon Intelligence sp. z o.o.` |
| SEO-207 | GA4 `G-9M4RZG70M2` z Consent Mode v2 (wszystko `denied`, `functionality/security_storage: granted`), tag ładowany leniwie dopiero po zgodzie; banner z dwoma równorzędnymi przyciskami; polityka prywatności zaktualizowana | test CDP: przed zgodą **0** żądań do `googletagmanager`; „Tylko niezbędne" → `denied`; „Akceptuję analitykę" → `consent update analytics_storage=granted` + `gtag/js?id=G-9M4RZG70M2` + `collect?v=2&tid=G-9M4RZG70M2` |
| SEO-208 | `vercel.json`: `x-content-type-options`, `x-frame-options`, `referrer-policy`, `permissions-policy`, `cross-origin-opener-policy`, HSTS. CSP świadomie pominięta | konfiguracja gotowa; wejdzie na produkcję przy deployu (`vercel deploy --prebuilt`) |
| SEO-209 | Tytuły: pełna forma ≤62 zn., potem skrócona z kategorią, na końcu bez roku; opisy kategorii z pierwszego zdania `intro` + liczb z bazy, twardo ≤158; tytuł i opis `/`, `/o-redakcji` skrócone | audyt `dist/`: 34/34 tytuły **≤62**, 34/34 opisy **≤158**, 0 duplikatów |
| SEO-210 | `redirects` w `astro.config.mjs` (stary slug Binance → `binance-bonus-powitalny-learn-earn`) | `.vercel/output/config.json`: `{"src":"^/promocja/binance-bonus-powitalny-za-rejestracje-i-depozyt$","status":301}` |
| SEO-211 | `BANK_PROMO_URLS` używane jako „Oficjalna strona promocji <bank>", nowa strona `/o-redakcji` (metoda weryfikacji, wzór ROI, czego nie robimy, oznaczenie linków), dane wydawcy w JSON-LD (`publisher`/`legalName`/`publishingPrinciples`) | 126 linków `rel="noopener"` do prawdziwych domen banków; `/o-redakcji` zbudowana (35 stron, +1 vs 34) |
| SEO-212 | Kontrast (`text-zinc-400` → `zinc-600`, `zinc-500` → `zinc-400` na ciemnym tle), `select#sort-select` z `aria-label`, usunięty zbędny `aria-label` z logo w headerze i footerze, status/etykieta odświeżane skryptem `is:inline` także po terminie | Lighthouse mobile: `/` **98/100/100/100**, oferta **99/100/100/100** (a11y 100, Agentic Browsing 67/33 → **100**) |
| SEO-213 | Regex nagłówków w `vercel.json` obejmuje `sitemap-index.xml` i `sitemap-0.xml` | `"/(sitemap[a-z0-9.-]*\\.xml\|robots\\.txt\|llms\\.txt)"` |
| SEO-214 | Immutable cache `/_astro/*` — dostarcza go adapter (`@astrojs/vercel`) | `.vercel/output/config.json`: `^/_astro/(.*)$ → cache-control: public, max-age=31536000, immutable` |
| SEO-215 | `/sitemap.xml` → 301 `/sitemap-index.xml` | `.vercel/output/config.json`: `{"src":"^/sitemap\\.xml$","status":301}` |

Bramki lokalne po zmianach: `pnpm typecheck` 0 błędów · `pnpm lint` — pozostały tylko
4 błędy sprzed sesji w `src/components/HeaderNav.tsx` (potwierdzone na wersji z HEAD) ·
`pnpm test` brak plików testowych · `pnpm build` 35 stron + 20/20 kart OG.

## Blog + Comperia — 2026-10-15 (sesja PO)

| Zakres | Co | Dowód |
|---|---|---|
| Blog `/blog` | content collection, indeks, `/blog/[slug]`, nav, llms.txt; 4 poradniki opublikowane + 1 szkic `draft:true` (podatek 2000 zł — przed publikacją konsultacja z doradcą) | commit `f47a280`; Lighthouse `/blog` i artykuł 99/100/100/100; 0 martwych linków `/promocja/`, 0 linków afiliacyjnych w treści |
| Comperia (audyt obcej pracy) | COM-001..011: klucz API → `.env.local`, zmyślone badge'y i obietnice RRSO/„0% prowizji" usunięte, tytuły ≤62, badge z danych, a11y 100, lint | commit `493b4f0`; Lighthouse kredyty/lokaty/chwilówki 99/100/100/100; `pnpm lint` = 2 pre-existing (HeaderNav) |
| Push | `42acfbd..493b4f0` → `origin/master` | produkcja **bez zmian** (deploy nadal wstrzymany na życzenie właściciela) |
