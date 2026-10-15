// Generator tabeli TOP ofert do miesięcznego wydania „Najlepsze sposoby na zarobek”.
// Źródło: dist/llms.txt (czyli opublikowany, przefiltrowany zestaw ofert — to co linkowalne).
// Użycie: pnpm build && node scripts/blog-top-offerty.mjs [limit]
// Wynik wklej do artykułu; NIE edytuj kwot ręcznie.
import fs from 'node:fs'

const limit = Number(process.argv[2] || 5)
const txt = fs.readFileSync('dist/llms.txt', 'utf-8')
const lines = txt.split('\n').filter((l) => l.startsWith('- [') && l.includes('| ROI '))

const parse = (l) => {
  const name = l.match(/- \[(.+?)\]\((\S+?)\):/)?.slice(1) ?? []
  // Pola czytamy z ogona linii — nazwy ofert też zawierają słowo „premia”.
  const tail = l.slice(l.indexOf('): ') + 3)
  const field = (label) => tail.match(new RegExp(`${label} ([^|]+)`))?.[1].trim()
  return {
    name: name[0],
    href: name[1],
    premia: field('premia'),
    roi: Number(field('ROI')?.match(/\d+/)?.[0] ?? 0),
    czas: field('czas'),
    termin: field('termin'),
    status: field('status'),
    bik: /bez BIK: tak/.test(tail) ? 'tak' : 'nie',
  }
}

const offers = lines.map(parse).filter((o) => o.status === 'Aktywna')
const sortDesc = (key) => [...offers].sort((a, b) => b[key] - a[key])

const table = (rows) =>
  ['| # | Oferta | Premia | Czas | Termin | ROI |', '|---|---|---|---|---|---|']
    .concat(
      rows.map(
        (o, i) =>
          `| ${i + 1} | [${o.name}](${o.href}) | ${o.premia} | ${o.czas} | ${o.termin} | **${o.roi} zł/h** |`,
      ),
    )
    .join('\n')

console.log('### Bankowe — TOP wg ROI\n')
console.log(table(sortDesc('roi').slice(0, limit)))
console.log('\n### Bez BIK — TOP wg ROI\n')
console.log(table(sortDesc('roi').filter((o) => o.bik === 'tak').slice(0, limit)))
console.log(`\n<!-- źródło: dist/llms.txt, ${offers.length} ofert aktywnych; weryfikacja u źródeł: ${txt.match(/weryfikacja ofert u źródeł: (\d{4}-\d{2}-\d{2})/)?.[1]} -->`)
