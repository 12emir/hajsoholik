# Znaleziska audytu — Hajsoholik.pl

Format: `ID | severity | pewność | kategoria | dowód | status`
Severity: P0 krytyczne · P1 wysokie · P2 średnie · P3 niskie · P4 polish

---

## Iteracja 1 — 2026-10-01 (pass 5: SEO techniczne / schema)

### SEO-001 — `priceValidUntil` w przeszłości na 23/36 promocjach
- **Severity:** P1 · **Pewność:** CONFIRMED · **Kategoria:** SEO / structured data
- **Dowód:** `src/pages/promocja/[slug].astro:167` (`priceValidUntil: promo.deadlineDate`).
  Pomiar produkcyjny 2026-10-01: `curl` po 36 slugach z `sitemap-0.xml` →
  **23/36** zwróciło `priceValidUntil` starszą niż dzień pomiaru
  (od `2026-08-19` do `2026-09-30`). Kontrola w `dist/` po fixie: 13 przyszłych, **0 przeszłych**.
- **Problem:** pole schema opisuje ważność ceny, a wstawiana była data zakończenia promocji.
  Po terminie Google uznaje ofertę za wygasłą i wycina rich result dla całej strony.
- **Root cause:** jedno źródło prawdy (`deadlineDate`) pełniło dwie różne role — termin
  promocji i termin ważności ceny. To nie literówka, to błąd modelu danych.
- **Fix:** `priceValidUntil` publikowany tylko gdy `deadlineDate >= data builda`
  (`buildDate = new Date().toISOString().slice(0,10)`); w przeciwnym razie pole pomijane.
- **Weryfikacja:** `pnpm build` → 51 stron; skan `dist/promocja/*/index.html` → 0 przeszłych.
- **Ryzyko regresji:** niskie — `Offer` nadal obecny (1 na stronę), pozostałe pola bez zmian.

### SEO-002 — `aggregateRating` z `ratingCount: 1` = self-serving review
- **Severity:** P1 · **Pewność:** CONFIRMED · **Kategoria:** SEO / E-E-A-T / uczciwość
- **Dowód:** `src/pages/promocja/[slug].astro:151-158` (usunięty blok). Produkcja:
  `"aggregateRating":{"ratingValue":4.3,"ratingCount":1,"reviewCount":1}` na **37** stronach.
  Źródło wartości: `editorialScore` wyliczany z `bezBIK`/`bezWplywu`/`netProfit` (linie 66-68).
- **Problem:** `aggregateRating` oznacza agregat opinii użytkowników. Tu jedyną „opinią"
  była ocena redakcji o własnej treści, policzona deterministycznie z flag oferty.
  Google klasyfikuje to jako *self-serving review* i nie wyświetla; dodatkowo to liczba,
  która wygląda jak dowód społeczny, a nim nie jest.
  Źródła: [Google — Review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet),
  [wątek Search Central o self-serving](https://support.google.com/webmasters/thread/263586515/aggregaterating-guidelines-concerns-solved?hl=en).
- **Root cause:** chęć posiadania gwiazdek w SERP wzięła górę nad tym, co pole faktycznie znaczy.
- **Fix:** usunięty `aggregateRating`; `Review` redakcji zostaje (jawnie „Ocena redakcji",
  widoczna w UI w linii 469) — czyli to, czym jest naprawdę.
- **Weryfikacja:** `dist` → `AggregateRating` **0** stron, `Review` **37** stron,
  222/222 bloków JSON-LD parsowalnych.
- **Ryzyko regresji:** niskie — `editorialScore`/`editorialStars` nadal używane w widocznym UI,
  nic nie zostało osierocone (`astro check`: 0 errors).

---

## Do weryfikacji (POSSIBLE — brak dowodu)

### SEO-003 — `site.updatedAt: '2026-08-14'` mimo zmian treści w październiku
- **Pewność:** POSSIBLE · **Kategoria:** SEO / świeżość
- `src/data/site.ts:14`. Data bazy sprzed 7 tygodni zasila `dateModified`,
  `datePublished` i wszystkie zdania „stan na…" w treści oraz FAQPage.
  Do potwierdzenia: czy to celowa data redakcyjna, czy pole zapomniane.
- **Aktualizacja 2026-10-15:** `site.ts` ma już `2026-10-11`, ale druga data bazowa
  została na sztywno w `astro.config.mjs:33` (`lastmod: new Date('2026-08-14')`) →
  patrz **SEO-204**. Połowiczny fix, źródło prawdy o świeżości nadal jest podwójne.

---

## Iteracja 2 — 2026-10-15 (pass 5 + 6: SEO techniczne i AI SEO na produkcji)

Pełny raport: `ITERATION_2_2026-10-15.md`.
Pomiar Lighthouse (mobile, produkcja): SEO **100**, Agentic Browsing **33** (home) /
**67** (promocja); Perf 100, LCP 1.2–1.6 s, CLS 0.

| ID | Sev | Pewność | Kategoria | Skrót |
|---|---|---|---|---|
| SEO-201 | P1 | CONFIRMED | SEO / treść / schema | Wygasła oferta jako „Aktywna" + `priceValidUntil` 2026-10-14 (wczoraj); licznik zamrożony w buildzie |
| SEO-202 | P1 | CONFIRMED | SEO / linki | 207/207 linków wychodzących bez `rel="sponsored"`/`nofollow` (cała monetyzacja) |
| SEO-203 | P1 | CONFIRMED | SEO / runtime | React #418 (hydration mismatch) na home — ten sam root cause co SEO-201 |
| SEO-204 | P2 | CONFIRMED | SEO / świeżość | `lastmod` 2026-08-14 na 33/33 URL vs `dateModified` 2026-10-11 |
| SEO-205 | P2 | CONFIRMED | SEO / OG | `og:image` = SVG na 20 stronach promocji + `stop-color="##0B1220"` |
| SEO-206 | P2 | CONFIRMED | AI SEO | `llms.txt` bez markdown-linków → Lighthouse `llms-txt` = 0 |
| SEO-207 | P2 | CONFIRMED | pomiar | Brak GA4/gtag na produkcji (regresja względem 2026-10-01) |
| SEO-208 | P2 | CONFIRMED | nagłówki | Brak CSP, `nosniff`, `referrer-policy`, `permissions-policy` |
| SEO-209 | P2 | CONFIRMED | on-page | Tytuły promocji 71–107 znaków, opisy kategorii 224–324 |
| SEO-210 | P2 | CONFIRMED | SEO / 301 | Dawniej zaindeksowany URL Binance → 404 (301 tylko w drugim klonie repo) |
| SEO-211 | P2 | CONFIRMED | E-E-A-T / AI | 0 linków do źródeł banków; „regulamin u mBank" → tracker; brak `/o-redakcji` |
| SEO-212 | P3 | CONFIRMED | a11y | `color-contrast`, `select-name`, `label-content-name-mismatch` = 0 na home |
| SEO-213 | P3 | CONFIRMED | cache | Regex `sitemap\.xml` nie łapie `sitemap-index.xml`/`sitemap-0.xml` |
| SEO-214 | P3 | CONFIRMED | cache | Hashowane `/_astro/*` i assety z `max-age=0, must-revalidate` |
| SEO-215 | P3 | CONFIRMED | SEO | `/sitemap.xml` → 404 |
