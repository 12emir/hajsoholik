/**
 * Mapowanie promocji Hajsoholik → program Leadstar (tid).
 * URL-e pobierane przy buildzie z API Leadstar (scripts/sync-leadstar.mjs).
 * Sync 2026-09-05: martwe TID (PKO 3469/3471/4264, Santander 5860) → aktywne lub WITHOUT.
 * Fix 2026-09-07: TID 32/33/34 były zamienione (Velo ↔ Erste ↔ Alior).
 */
export const PROMO_LEADSTAR_TID: Record<number, number> = {
  // mBank — aktywne
  2: 5564, // eKonto (listing 500 zł) → eKonto z zyskiem do 1010 zł
  10: 5564, // mOkazje → eKonto
  16: 5564, // eKonto z zyskiem do 1010 zł
  17: 5550, // eKonto dla młodych 18–24 do 910 zł
  18: 6093, // Firmootwieracz + mBiznes
  26: 6311, // eKonto + Visa Podróże do 1010 zł
  27: 6205, // eKonto + bony Media Expert do 1000 zł
  28: 6316, // eKonto + bony Biedronka do 1000 zł
  29: 6117, // mKonto Intensive do 1010 zł

  // Nest Bank
  19: 4838, // Nest Konto
  20: 4835, // BIZnest Konto

  // PKO BP — aktywne zamienniki
  21: 3431, // Konto Za Zero (Allegro cashback)
  30: 6284, // Konto Za Zero z Moneyback do 1500 zł

  // Alior
  5: 5009, // iKonto Biznes do 4000 zł
  33: 5009, // iKonto Biznes (ta sama promocja co id 5)

  // Pekao
  24: 2637, // Konto Przekorzystne
  31: 6159, // Konto Oszczędnościowe + Przekorzystne
  35: 4977, // Karta Kredytowa z Żubrem

  // VeloBank
  22: 5545, // VeloKonto
  23: 5530, // Elastyczne Konto Oszczędnościowe
  32: 5907, // VeloKonto dla młodych 18–26

  // Erste
  34: 5980, // Konto Smart do 900 zł
}

/** Promocje bez aktywnego programu Leadstar — CTA z MANUAL / bank URL / ukryte. */
export const PROMOS_WITHOUT_LEADSTAR = new Set([
  1, // ING konto + 7%
  3, // Santander karta — program Leadstar zakończony (5860)
  4, // PKO Konto dla Młodych — TID 3471 zakończony
  6, // BNP Konto Otwarte
  7, // Revolut (manual referral)
  8, // Millennium
  9, // ING karta
  11, // Santander polecenie — TID 5860 zakończony
  12, // PKO firmowe — TID 4264 zakończony
  13, // Alior oszczędnościowe
  14, // BNP konto + karta
  15, // Revolut archiwalna
  25, // Pekao Biznes Żubr — brak w Leadstar
])
