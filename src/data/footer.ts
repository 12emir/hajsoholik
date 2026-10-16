/** Footer navigation — single source for Footer.astro. */

export const footerCategories = [
  { label: 'Konta osobiste', href: '/kategoria/konta-osobiste' },
  { label: 'Konta firmowe', href: '/kategoria/konta-firmowe' },
  { label: 'Karty kredytowe', href: '/kategoria/karty-kredytowe' },
  { label: 'Kredyty gotówkowe', href: '/kredyty-gotowkowe' },
  { label: 'Lokaty bankowe', href: '/lokaty-bankowe' },
  { label: 'Pożyczki chwilówki', href: '/pozyczki-chwilowki' },
  { label: 'Oszczędnościowe', href: '/kategoria/oszczednosciowe' },
  { label: 'Krypto', href: '/kategoria/krypto' },
] as const

export const footerService = [
  { label: 'Wszystkie promocje', href: '/' },
  { label: 'Sposoby na dorabianie', href: '/sposoby-na-dorabianie' },
  { label: 'Kończące się', href: '/konczace-sie' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Informacje dla AI', href: '/llms.txt' },
] as const

export const footerLegal = [
  { label: 'Polityka prywatności', href: '/polityka-prywatnosci' },
  { label: 'Regulamin', href: '/regulamin' },
] as const

export const footerContact = 'hi@zordonintelligence.pl'
