import type { APIRoute } from 'astro'
import { PROMOTIONS, promoPath } from '../data/promotions'
import { site } from '../data/site'

export const GET: APIRoute = () => {
  const activePromos = PROMOTIONS.filter((p) => p.status !== 'Archiwalna')
  const promoLines = activePromos
    .map((p) => {
      const url = `${site.url}${promoPath(p)}`
      return `- ${p.bank}: ${p.title} — do ${p.bonus} zł premii (${p.category}) — ${url}`
    })
    .join('\n')

  const offerLines = activePromos
    .map(
      (p) =>
        `- ${p.bank} | ${p.title} | premia ${p.bonus} zł | koszt ${p.cost} zł | ROI ${p.roi} zł/h | czas ${p.time} | termin ${p.deadlineDate} (${p.deadlineDays} dni) | status ${p.status} | trudność ${p.difficulty} | bez BIK: ${p.bezBIK ? 'tak' : 'nie'} | weryfikacja ${p.verifiedAt} | ${site.url}${promoPath(p)}`,
    )
    .join('\n')

  const body = `# Hajsoholik.pl

> Najlepsze promocje bankowe w Polsce 2026 w jednym miejscu.
> Agregator premii za założenie konta osobistego i firmowego, kart kredytowych,
> kont oszczędnościowych i lokat, a także ankiet i aplikacji. Porównanie bonusów,
> warunków, czasu realizacji i ROI (zł/h).
> Ostatnia aktualizacja: ${site.updatedAt}.

## Strona główna (listing + porównywarka)
- ${site.url}/

## Kategorie promocji (strony hubów)
- Konta osobiste: ${site.url}/kategoria/konta-osobiste
- Konta firmowe: ${site.url}/kategoria/konta-firmowe
- Karty kredytowe: ${site.url}/kategoria/karty-kredytowe
- Oszczędnościowe: ${site.url}/kategoria/oszczednosciowe
- Polecenia: ${site.url}/kategoria/polecenia
- Cashback: ${site.url}/kategoria/cashback
- Ankiety/Aplikacje: ${site.url}/kategoria/ankiety-aplikacje
- Promocje kończące się: ${site.url}/konczace-sie

## Oferty (${activePromos.length} — dane do porównania programowego)
${offerLines}

## Dedykowane strony promocji (${activePromos.length})
${promoLines}

## Informacje
- Built by: Hajsoholik (redakcja promocji bankowych)
- Kontakt: https://hajsoholik.pl/kontakt
- Strony prawne: ${site.url}/regulamin • ${site.url}/polityka-prywatnosci
- Data aktualizacji bazy ofert: ${site.updatedAt}

> Zastrzeżenie: Hajsoholik nie jest poradą finansową. Dane poglądowe, oferty mogą
> się różnić w zależności od banku. Linki do banków są linkami afiliacyjnymi.
`
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
