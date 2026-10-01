# Zakończone — Hajsoholik.pl

| ID | Co | Data | Dowód weryfikacji |
|---|---|---|---|
| SEO-001 | `priceValidUntil` nie może być datą przeszłą | 2026-10-01 | produkcja: 23/36 → **0/36** przeszłych |
| SEO-002 | usunięty `aggregateRating` (self-serving) | 2026-10-01 | produkcja: 37 → **0** stron; `Review` 37 zachowany |
| CLEAN-001 | martwy kod `NAV_LINKS` + `NAV_ITEMS` (+ link 404) | 2026-10-01 | `grep src/` → 0 odwołań; build 51 stron |

Poprzednie sesje (kontekst): `app-ads.txt` 200, 10/10 linków afiliacyjnych krypto,
footer 14 linków, strona główna bez panelu „Twój postęp", `og-default.png` 1200×630,
restauracja `SiteHeader`/`Footer`/`CookieBanner` po usunięciu `bare`.
