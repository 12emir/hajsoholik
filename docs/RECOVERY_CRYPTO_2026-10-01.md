# Odzyskanie ofert krypto — 2026-10-01

## Objaw
Karty krypto były widoczne na `hajsoholik.pl`, ale **żadna nie prowadziła do giełdy**.
Zero `href` z linkiem afiliacyjnym — klikanie nie zarabiało.

## Przyczyna źródłowa
Repozytorium i produkcja były **rozjechane**:

| | repo (przed) | produkcja |
|---|---|---|
| oferty krypto | **0 z 25** | 12 widocznych |
| `crypto-affiliates.ts` | brak | był |
| `crypto-promotions` | brak | był |
| kategoria `Krypto` | brak | była |
| `public/partners/` | brak | 12 logo |

Kod kart (`PromotionCard.tsx:137`) czyta `promo.url` — ale `promo.url` wypełniane jest
tylko z `BANK_PROMO_URLS`. Dla giełd nie ma tam wpisu, więc link zostawał pusty.
Krypto-ofiar nie było też w `PROMOTIONS`, więc `CRYPTO_AFFILIATE_URLS` nie miało
do czego się przyczepić.

## Skąd dane
Deploy produkcyjny Vercel `dpl_Gtc9LgDgJm1Dmj8MzcKBVnsCZ3gW` (production, 2026-09-12 14:45),
odczytany przez Vercel MCP `get_deployment_file_contents` + JSON-LD z żywej strony.
Krypto żyło w deployach **05.09–12.09**, zniknęło między `dpl_Gtc9LgDgJm1Dmj8MzcKBVnsCZ3gW`
(12.09 14:45) a `dpl_2AF58C7FTq7DPrdtbYw1sF4UUr6u` (15.09 15:03).

## Naprawa
1. `src/data/crypto-affiliates.ts` — 12 linków afiliacyjnych (odzyskane 1:1 z deployu)
2. `src/data/crypto-promotions.ts` — 12 ofert (`id` 100–111, `category: 'Krypto'`)
3. `src/data/promotions.ts` — `PROMOTIONS.push(...CRYPTO_PROMOTIONS)` + `CRYPTO_AFFILIATE_URLS`
   w łańcuchu `promo.url` (przed `BANK_PROMO_URLS`)
4. `src/data/promotions.ts` — kategoria `'Krypto'` w `Category` i `CATEGORIES`
5. `src/components/app/cards/PromotionCard.tsx` — logo giełdy z `CRYPTO_LOGO_URLS`
6. `public/partners/` — 12 logo (pobrane z produkcji)

## Weryfikacja (build 51 stron)
- 12/12 ofert krypto w `dist/index.html`
- **12/12 linków afiliacyjnych w statycznym HTML** (nie tylko w bundlu JS)
- 12/12 logo w HTML, wszystkie pliki obecne w `dist/partners/`
- `/kategoria/krypto/index.html` istnieje

Przykład — Bybit:
`href="https://www.bybit.com/register?affiliate_id=16319&group_id=0&group_type=1"`

## Czego NIE zweryfikowano
- Wygląd na ekranie (brak dostępu do przeglądarki).
- `bonus` dla ofert krypto to **szacunek** odzyskany z opisów redakcyjnych, nie potwierdzona kwota.
- Deploy na produkcję po tej zmianie — repo ma teraz pełną treść, więc kolejny deploy
  odtworzy krypto z kodu (wcześniej tego nie robił).
