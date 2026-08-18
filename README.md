# Hajsoholik.pl

Agregator promocji bankowych — konto osobiste, konta firmowe, karty kredytowe, konto oszczędnościowe, ankiety, cashback, polecenia. PL-only.

## Stack

- **Astro 5** (SSG) + React islands + Tailwind CSS v4
- Deploy: Vercel
- SEO: hand-rolled `robots.txt` / `llms.txt` + `@astrojs/sitemap`, JSON-LD (Product/FAQPage/ItemList/BreadcrumbList), per-promo OG images (SVG endpoint)

## Struktura

```
src/
  data/promotions.ts    # dane ofert (25 promocji) — bonus, termin, trudność, verifiedAt
  data/site.ts          # meta serwisu
  pages/index.astro     # home + feed promocji
  pages/promocja/[slug].astro  # dedykowana strona każdej promocji
  pages/kategoria/[slug].astro # strony kategorii
  pages/konczace-sie.astro     # promocje kończące się najszybciej
  pages/og/[slug].svg.ts       # generacja og:image per promocja
  pages/llms.txt.ts / robots.txt.ts
  layouts/BaseLayout.astro
  components/app/       # React islands (feed, filtry, detale)
```

## Komendy

```bash
pnpm install
pnpm dev        # http://127.0.0.1:5183
pnpm build      # SSG do dist/
pnpm preview
pnpm lint       # biome check
pnpm typecheck  # astro check
```

## Treść

Wszystkie oferty weryfikowane ręcznie względem źródeł banków (`verifiedAt`). Polityka korekt i zgłaszania błędów: `/kontakt`.
