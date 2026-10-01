# Regresje — Hajsoholik.pl

## 2026-10-01 — po deploy `layfp3ibw` (SEO-001, SEO-002)

Wszystkie sprawdzone na **produkcji**, nie na dev-serverze.

| Ścieżka | Oczekiwane | Wynik |
|---|---|---|
| `/` | 200 | 200 |
| `/konczace-sie` | 200 | 200 |
| `/kontakt` | 200 | 200 |
| `/polityka-prywatnosci` | 200 | 200 |
| `/regulamin` | 200 | 200 |
| `/kategoria/krypto` | 200 | 200 |
| `/kategoria/konta-osobiste` | 200 | 200 |
| `/app-ads.txt` | 200 | 200 |
| `/llms.txt` | 200 | 200 |
| `/sitemap-index.xml` | 200 | 200 |
| `/og-default.png` | 200 | 200 |

| Kontrola | Oczekiwane | Wynik |
|---|---|---|
| Bloki `<header>` na home | 1 | **1** (6 linków) |
| Bloki `<footer>` na home | 1 | **1** (**14** linków) |
| Krypto w footerze | obecne | **obecne** |
| Chip nav mobilny (`lg:hidden`) | obecny | **obecny** |
| 404 → `noindex, follow` | tak | **tak** + header/footer |
| JSON-LD parsowalny | 100% | **222/222** |
| `pnpm build` | 51 stron | **51** |
| `astro check` | 0 errors | **0 errors, 0 warnings** |

## Regresje historyczne (kontekst sesji)
- Promocja `dpl_ArzCuuSjGuhe5uMHBUrXMDH3YECA` (05.09) cofnęła 8 plików vs repo
  (`app-ads.txt`, `apple-touch-icon.png`, `manifest.webmanifest`, `brave.svg`,
  `firefaucet.svg`, `404.astro`, `[slug].astro`) → naprawione deployem z repo.
- Deploy z repo cofnął footer/header Emira (20→3, 7→1) przez `bare` w `index.astro`
  i hardcoded `<header>`/`<footer>` w wyspie → naprawione usunięciem `bare` i obu elementów.
