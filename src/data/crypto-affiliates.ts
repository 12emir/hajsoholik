/**
 * Linki afiliacyjne ofert krypto (nie Leadstar).
 * ID muszą 1:1 zgadzać się z PROMOTIONS (bank name).
 * Źródło: inventory Emira — bez wyświetlania kodów ref w UI.
 *
 * ODZYSKANE 2026-10-01 z deployu Vercel `dpl_Gtc9LgDgJm1Dmj8MzcKBVnsCZ3gW`
 * (production, 2026-09-12 14:45). Plik zniknął z repo między 12.09 a 15.09 —
 * karty krypto zostały na stronie, ale bez linków, więc klikanie nie zarabiało.
 *
 * Brave (110) i FireFaucet (111) — linki na oficjalne URL
 * (brak klasycznego CPA; SEO/CTA value, nie prowizja).
 */
export const CRYPTO_AFFILIATE_URLS: Record<number, string> = {
  100: 'https://accounts.binance.com/pl/register?ref=21998066', // Binance
  101: 'https://www.bitget.com/en/referral/register?from=referral&clacCode=KUP8FDBM', // Bitget
  102: 'https://www.okx.com/join/31375503', // OKX
  103: 'https://www.kucoin.com/ucenter/signup?rcode=25HbH3y', // KuCoin
  104: 'https://www.bybit.com/register?affiliate_id=16319&group_id=0&group_type=1', // Bybit
  105: 'https://nexo.io/ref/ohr0x1tce7?src=web-link', // Nexo
  106: 'https://swissborg.com/r/emirOM2D', // SwissBorg
  107: 'https://cakedefi.com/?ref=161676', // Cake DeFi
  108: 'https://shop.ledger.com/?r=1ecdc75943c8', // Ledger
  109: 'https://cointiply.com/r/n0KyGn', // Cointiply
  110: 'https://brave.com/rewards/', // Brave (no CPA)
  111: 'https://firefaucet.com/', // FireFaucet (no CPA)
}

/** Lokalne loga ofert krypto (`public/partners/*`). */
export const CRYPTO_LOGO_URLS: Record<number, string> = {
  100: '/partners/binance.jpg',
  101: '/partners/bitget.png',
  102: '/partners/okx.jpeg',
  103: '/partners/kucoin.webp',
  104: '/partners/bybit.jpg',
  105: '/partners/nexo.webp',
  106: '/partners/swissborg.jpg',
  107: '/partners/cake.jpeg',
  108: '/partners/ledger.webp',
  109: '/partners/cointiply.webp',
  110: '/partners/brave.svg',
  111: '/partners/firefaucet.svg',
}
