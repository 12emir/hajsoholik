import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5183'
const exec = '/Users/kozakiewicz/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'
const out = '/Users/kozakiewicz/apps/hajsoholik/.shots'

const browser = await chromium.launch({ executablePath: exec })
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })

// Home with CTA cards
await page.goto(base + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.screenshot({ path: out + '/home-cta.png', fullPage: false })
console.log('saved home-cta.png')

// Promo page hero CTA
await page.goto(base + '/promocja/ekonto-z-zyskiem-do-1010-zl', { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.screenshot({ path: out + '/promo-cta.png', fullPage: false })
console.log('saved promo-cta.png')

await browser.close()
