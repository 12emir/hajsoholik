import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'
import { PROMOTIONS, deadlineHuman, promoPath, statusOf } from '../data/promotions'
import { SIDEHUSTLES } from '../data/sidehustles'
import { site } from '../data/site'

export const GET: APIRoute = async () => {
  // Status wyliczany z daty, tak samo jak na stronach — llms.txt nie może
  // powtarzać nieaktualnego snapshotu z importu danych.
  const now = new Date(`${site.buildDate}T12:00:00+02:00`)
  const activePromos = PROMOTIONS.filter((p) => statusOf(p.deadlineDate, now) !== 'Archiwalna')

  const promoLines = activePromos
    .map(
      (p) =>
        `- [${p.title}](${site.url}${promoPath(p)}) — ${p.bank}, do ${p.bonus} zł premii (${p.category}), termin ${deadlineHuman(p.deadlineDate)}`,
    )
    .join('\n')

  const offerLines = activePromos
    .map(
      (p) =>
        `- [${p.bank} — ${p.title}](${site.url}${promoPath(p)}): premia ${p.bonus} zł | koszt ${p.cost} zł | ROI ${p.roi} zł/h | czas ${p.time} | termin ${deadlineHuman(p.deadlineDate)} | status ${statusOf(p.deadlineDate, now)} | trudność ${p.difficulty} | bez BIK: ${p.bezBIK ? 'tak' : 'nie'} | weryfikacja ${p.verifiedAt}`,
    )
    .join('\n')

  // Blog: szkice (draft: true) nie trafiają do llms.txt.
  const blogPosts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) =>
    b.data.publishedAt.localeCompare(a.data.publishedAt),
  )
  const blogLines = blogPosts
    .map((post) => `- [${post.data.title}](${site.url}/blog/${post.id}): ${post.data.description}`)
    .join('\n')

  const sidehustleLines = SIDEHUSTLES.map(
    (h) =>
      `- [${h.platform} — ${h.title}](${site.url}/sposoby/${h.seoSlug}): zysk ${h.earningsDisplay} | ROI ~${h.roiPerHour} zł/h | start ${h.capitalRequired} zł | typ ${h.incomeTypeLabel}`,
  ).join('\n')

  const body = `# Hajsoholik.pl

> Najlepsze promocje bankowe w Polsce 2026 w jednym miejscu.
> Agregator premii za założenie konta osobistego i firmowego, kart kredytowych,
> kont oszczędnościowych i lokat, a także ankiet i aplikacji. Porównanie bonusów,
> warunków, czasu realizacji i ROI (zł/h).
> Ostatnia weryfikacja ofert u źródeł: ${site.updatedAt}. Wydawca: ${site.publisher}

## Strona główna (listing + porównywarka)
- [Promocje bankowe 2026](${site.url}/)

## Biblioteka Sposobów Zarabiania (poza bankami)
- [Sposoby na dorabianie 2026 — baza sprawdzonych metod](${site.url}/sposoby-na-dorabianie)

## Kategorie promocji (strony hubów)
- [Konta osobiste](${site.url}/kategoria/konta-osobiste)
- [Konta firmowe](${site.url}/kategoria/konta-firmowe)
- [Karty kredytowe](${site.url}/kategoria/karty-kredytowe)
- [Oszczędnościowe](${site.url}/kategoria/oszczednosciowe)
- [Polecenia](${site.url}/kategoria/polecenia)
- [Cashback](${site.url}/kategoria/cashback)
- [Ankiety/Aplikacje](${site.url}/kategoria/ankiety-aplikacje)
- [Promocje kończące się](${site.url}/konczace-sie)

## Porównywarki i rankingi produktów finansowych (SSG)
- [Ranking kredytów gotówkowych 2026](${site.url}/kredyty-gotowkowe) — porównanie rat, prowizji i RRSO
- [Ranking lokat bankowych 2026](${site.url}/lokaty-bankowe) — oprocentowanie i zysk netto
- [Pożyczki pozabankowe i chwilówki 2026](${site.url}/pozyczki-chwilowki) — pierwsza za 0 zł, wypłata online

## Sposoby na dorabianie (${SIDEHUSTLES.length} zweryfikowanych metod)
${sidehustleLines}

## Oferty (${activePromos.length} — dane do porównania programowego)
${offerLines}

## Dedykowane strony promocji (${activePromos.length})
${promoLines}

## Blog (poradniki)
${blogLines}

## Informacje
- [O redakcji i metodzie weryfikacji](${site.url}/o-redakcji)
- [Kontakt](${site.url}/kontakt)
- [Regulamin](${site.url}/regulamin)
- [Polityka prywatności](${site.url}/polityka-prywatnosci)
- [Mapa strony](${site.url}/sitemap.xml)
- Data ostatniej weryfikacji bazy ofert: ${site.updatedAt}

## Definicje pól
- premia: maksymalna kwota deklarowana w regulaminie promocji (zł).
- ROI: (premia − koszty) ÷ czas pracy w godzinach; szacunek redakcji.
- termin: ostatni dzień obowiązywania promocji wg regulaminu; status liczony z tej daty.
- bez BIK: oferta nie wymaga weryfikacji w Biurze Informacji Kredytowej.

> Zastrzeżenie: Hajsoholik nie jest poradą finansową. Dane poglądowe, oferty mogą
> się różnić w zależności od banku. Linki do banków mogą być linkami afiliacyjnymi.
`
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
