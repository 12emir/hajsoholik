import type { APIRoute, GetStaticPaths } from 'astro'
import { PROMOTIONS, slugify } from '../../data/promotions'
import { site } from '../../data/site'

export const getStaticPaths = (() => {
  return PROMOTIONS.map((promo) => ({
    params: { slug: slugify(promo.title) },
    props: { promo },
  }))
}) satisfies GetStaticPaths

interface Props {
  promo: (typeof PROMOTIONS)[number]
}

const bonusPrefix = (kind?: string) => {
  if (kind === 'interest') return 'z odsetek'
  if (kind === 'monthly') return 'cashback /mc'
  return 'premii'
}

export const GET: APIRoute<Props> = ({ props }) => {
  const { promo } = props

  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const color = promo.color.replace('#', '')
  const dark = '#0B1220'
  const brand = '#00C26E'
  const title = esc(promo.title)
  const bonus = promo.bonus.toLocaleString('pl-PL')
  const kindLabel = bonusPrefix(promo.bonusKind)
  const sub = esc(`${promo.bank} • ${promo.category} • ${promo.time}`)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#${dark}"/>
      <stop offset="1" stop-color="#${color}"/>
    </linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#${brand}"/>
      <stop offset="1" stop-color="#4ade80"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="80" r="220" fill="#${brand}" opacity="0.12"/>
  <circle cx="120" cy="560" r="180" fill="#ffffff" opacity="0.05"/>
  <text x="64" y="92" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="#${brand}">Hajsoholik</text>
  <text x="64" y="250" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#ffffff">${title}</text>
  <rect x="64" y="300" width="360" height="8" rx="4" fill="url(#acc)"/>
  <text x="64" y="420" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="900" fill="#ffffff">${bonus} zł</text>
  <text x="64" y="470" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#4ade80">${kindLabel}</text>
  <text x="64" y="548" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="#e2e8f0">${sub}</text>
  <text x="64" y="596" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">${site.url}</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
