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
