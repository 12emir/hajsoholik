// Postbuild: konwersja wygenerowanych kart OG (SVG) na JPEG 1200×630, których
// wymagają Facebook/X/LinkedIn — SVG w og:image nie renderuje się na tych kanałach.
// sips jest częścią macOS (bez nowej zależności); na innym systemie kroku nie ma.
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST_OG = 'dist/og'
const STATIC_OG = '.vercel/output/static/og'

if (process.platform !== 'darwin') {
  console.log('[og] pomijam rasteryzację (sips dostępny tylko na macOS)')
} else if (!existsSync(DIST_OG)) {
  console.log('[og] brak dist/og — nic do konwersji')
} else {
  const svgs = readdirSync(DIST_OG).filter((file) => file.endsWith('.svg'))
  mkdirSync(STATIC_OG, { recursive: true })
  let converted = 0
  for (const file of svgs) {
    const source = join(DIST_OG, file)
    const target = join(DIST_OG, file.replace(/\.svg$/, '.jpg'))
    try {
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '85', source, '--out', target], {
        stdio: 'ignore',
      })
    } catch (error) {
      console.warn(`[og] nie udało się przekonwertować ${file}: ${error.message}`)
      continue
    }
    if (!existsSync(target) || statSync(target).size === 0) {
      console.warn(`[og] pusty plik po konwersji: ${file}`)
      continue
    }
    copyFileSync(target, join(STATIC_OG, file.replace(/\.svg$/, '.jpg')))
    converted += 1
  }
  console.log(`[og] przekonwertowano ${converted}/${svgs.length} kart OG do JPEG`)
}
