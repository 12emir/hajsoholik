# Backlog audytu — Hajsoholik.pl

| ID | Typ | Priorytet | Co | Warunek wejścia |
|---|---|---|---|---|
| SEO-004 | FIX | P2 | Dodać `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, `permissions-policy` | Osobny task — zmiana nagłówków globalnych wymaga pełnej regresji |
| SEO-003 | DECYZJA | P2 | `site.updatedAt` = `2026-08-14` mimo zmian w październiku | **Częściowo rozstrzygnięte 2026-10-15:** `site.ts` = `2026-10-11`; została sztywna data w `astro.config.mjs:33` → SEO-204 |
| MISS-001 | IDEA | P1 | Odtworzyć brakujące strony: `/poradnik/latwe-promocje-bez-bik`, `/bank/mbank`, `/o-redakcji`, `/polityka-cookies` | Linki już usunięte (nie ma 404). Strony wymagają treści — zero dummy data. Właściciel decyduje, które wracają |
| PERF-001 | ✅ ZAMKNIĘTE | — | Pomiar Lighthouse/CWV | **Zamknięte 2026-10-15:** API programowe Lighthouse + własny headless Chrome działa. `/` Perf 100, LCP 1.2 s, CLS 0, TBT 0 ms (mobile, produkcja) |

## Iteracja 2 — 2026-10-15 (nowe)

| ID | Typ | Priorytet | Co | Warunek wejścia |
|---|---|---|---|---|
| SEO-201 | FIX | **P1** | Stan zależny od czasu (licznik/status/`priceValidUntil`) liczony w buildzie i zamrażany; wygasła oferta jako „Aktywna" | Jeden root cause z SEO-203 → jedno zadanie: czas w komponencie + **bramka buildowa** na wygasłe oferty „Aktywne" |
| SEO-202 | FIX | **P1** | `rel="sponsored"` (+`noopener`) na wszystkich linkach afiliacyjnych — dziś 207/207 bez niego | Wspólny helper na link wychodzący; regresja: licznik w artefakcie |
| SEO-203 | FIX | **P1** | React #418 hydration mismatch na home (ten sam root cause co SEO-201) | Razem z SEO-201 |
| SEO-204 | FIX | P2 | `lastmod` sitemapy: usunąć `new Date('2026-08-14')` z `astro.config.mjs:33` | Po ustaleniu jednej daty bazowej |
| SEO-205 | FIX | P2 | `og:image` per oferta w PNG/JPEG + `stop-color="##…"` → `#…` | Strony są udostępniane — brak podglądu na FB/X/LinkedIn |
| SEO-206 | FIX | P2 | `llms.txt`: markdown-linki zamiast gołych URL-i | Lighthouse `llms-txt` = 0 → Agentic Browsing 33 |
| SEO-207 | DECYZJA | P2 | Brak GA4/`gtag` na produkcji — czy wraca pomiar? | Właściciel: GA4 + Consent Mode albo świadomy brak i pomiar tylko z GSC |
| SEO-208 | FIX | P2 | CSP, `nosniff`, `referrer-policy`, `permissions-policy` | Zmiana nagłówków globalnych → pełna regresja |
| SEO-209 | FIX | P2 | Skrócić `pageTitle` (71–107 zn.) i opisy kategorii (224–324 zn.) | Dotyka 28 stron — jeden szablon |
| SEO-210 | FIX | P2 | 301 dla starego slugu Binance (404 na produkcji) | Przenieść `redirects` z drugiego klonu |
| SEO-211 | FIX | P2 | Link do regulaminu banku + nazwany autor/`/o-redakcji` | `BANK_PROMO_URLS` już w danych, nieużywany; wymaga decyzji o tożsamości redakcji |
| SEO-212 | FIX | P3 | `select#sort-select` bez etykiety; kontrast `text-zinc-400`; `aria-label` logo | Wpływa na Agentic Browsing home (33/100) |
| SEO-213 | FIX | P3 | Regex cache w `vercel.json` nie łapie plików sitemapy | Jedna linia |
| SEO-214 | FIX | P3 | Immutable cache dla hashowanych `/_astro/*` i assetów | Konfiguracja nagłówków |
| SEO-215 | POLISH | P4 | `/sitemap.xml` → 404 | Alias/redirect na `sitemap-index.xml` |
| REPO-001 | DECYZJA | P1 | Dwa rozjechane klony (`hajsoholik` = produkcja vs `hajsoholik-web` z `/bank/*`, redirectem, `AppDownloadCTA`) | Właściciel: który jest kanonem? Czy funkcje z drugiego klonu mają trafić na produkcję? |

## Reguły backlogu
- `FIX` — konkretna zmiana, znany plik, można wziąć od razu.
- `DECYZJA` — wymaga odpowiedzi właściciela, agent nie zgaduje.
- `IDEA` — pomysł produktowy; nie implementowany w trakcie audytu.
- `BLOKADA` — nie da się ruszyć w obecnym środowisku; wymaga zmiany po stronie człowieka.
