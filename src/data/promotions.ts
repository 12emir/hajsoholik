/**
 * Dane promocji bankowych — 1:1 z artifactu Hajsoholik-Listing-Promocji-Bankowych.html.
 * Każda oferta opisana wg oryginalnego modelu (bonus, ROI, deadline, warunki, haczyki).
 */

export type Category =
  | 'Konta osobiste'
  | 'Konta firmowe'
  | 'Karty kredytowe'
  | 'Oszczędnościowe'
  | 'Polecenia'
  | 'Cashback'
  | 'Ankiety/Aplikacje'

export type Difficulty = 'Łatwa' | 'Średnia' | 'Trudna'

export type Time = '15min' | '1h' | '3h+'

export type Status = 'Aktywna' | 'Kończy się w 48h' | 'Archiwalna'

/**
 * Rodzaj wartości oferty — determinuje jak nazywamy `bonus` w UI/schema.
 * - `cash`: jednorazowa premia gotówkowa (default)
 * - `interest`: wartość to szacunkowy zysk z odsetek (np. konto oszczędnościowe)
 * - `monthly`: wartość to cykliczny cashback (np. miesięczny limit zwrotów)
 */
export type BonusKind = 'cash' | 'interest' | 'monthly'

/** Normalizuje polski tekst do slug URL (bez znaków diakrytycznych, lowercase, spacje → `-`). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Ścieżka dedykowanej strony promocji (stable canonical URL). */
export function promoPath(promo: Pick<Promotion, 'id' | 'title'>): string {
  return `/promocja/${slugify(promo.title)}`
}

export interface Promotion {
  id: number
  bank: string
  bankInitial: string
  color: string
  category: Category
  title: string
  bonus: number
  /** Rodzaj wartości oferty (premia/odsetki/cashback). */
  bonusKind?: BonusKind
  /** Data końca promocji (YYYY-MM-DD) — wyliczany stąd deadline. */
  deadlineDate: string
  deadlineDays: number
  deadlineLabel: string
  /** Data ostatniej weryfikacji regulaminu przez redakcję (YYYY-MM-DD). */
  verifiedAt: string
  difficulty: Difficulty
  time: Time
  timeMinutes: number
  tags: string[]
  requirements: string[]
  cost: number
  status: Status
  popularity: number
  description: string
  haczyki: string[]
  comments: number
  featured: boolean
  bezBIK: boolean
  bezWplywu: boolean
  roi: number
  /** Krótki opis grupy docelowej — pokazywany w hero i schema ("Dla kogo"). */
  audience?: string
  /** Dodatkowe pytanie FAQ unikalne dla tego programu (np. różnicujące podobne oferty tego samego banku). */
  faqExtra?: { q: string; a: string }
}

/** Zwraca liczbę dni do końca promocji (0 gdy minęła) i czytelny label z daty. */
export function deadlineFrom(dateISO: string): { days: number; label: string } {
  const end = new Date(`${dateISO}T23:59:59+02:00`)
  const now = new Date()
  const days = Math.ceil((end.getTime() - now.getTime()) / 86_400_000)
  if (days <= 0) return { days: 0, label: 'Oferta zakończona' }
  if (days === 1) return { days: 1, label: 'ostatni dzień!' }
  if (days < 5) return { days, label: `zostały ${days} dni` }
  return { days, label: `zostało ${days} dni` }
}

/** Oficjalne strony promocji banków — źródło regulaminu i warunków oferty. */
const BANK_PROMO_URLS: Record<string, string> = {
  mBank: 'https://www.mbank.pl/indywidualny/promocje/',
  'Nest Bank': 'https://www.nestbank.pl/',
  ING: 'https://www.ing.pl/',
  Santander: 'https://www.santander.pl/promocje',
  PKO: 'https://www.pkobp.pl/promocje/',
  Alior: 'https://www.aliorbank.pl/promocje/',
  'BNP Paribas': 'https://www.bnpparibas.pl/',
  BNP: 'https://www.bnpparibas.pl/',
  VeloBank: 'https://www.velobank.pl/konta/',
  Millennium: 'https://www.bankmillennium.pl/',
  Pekao: 'https://www.pekao.com.pl/',
  Revolut: '',
}

/** Oficjalna strona banku z promocjami (regulamin) lub '' gdy brak. */
export function bankPromoUrl(bank: string): string {
  return BANK_PROMO_URLS[bank] ?? ''
}

export const CATEGORIES: Category[] = [
  'Konta osobiste',
  'Konta firmowe',
  'Karty kredytowe',
  'Oszczędnościowe',
  'Polecenia',
  'Cashback',
  'Ankiety/Aplikacje',
]

export const BANKS = [
  'ING',
  'mBank',
  'Santander',
  'PKO',
  'Alior',
  'BNP',
  'Revolut',
  'Millennium',
  'Nest Bank',
  'VeloBank',
  'Pekao',
]

export const DIFFICULTIES: Difficulty[] = ['Łatwa', 'Średnia', 'Trudna']

export const TIMES: Time[] = ['15min', '1h', '3h+']

export const STATUSES: Status[] = ['Aktywna', 'Kończy się w 48h', 'Archiwalna']

export const SORT_OPTIONS = [
  'Najwyższa premia',
  'Najlepsze ROI/h',
  'Najłatwiejsza',
  'Kończy się najszybciej',
  'Popularność',
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Łatwa: 0,
  Średnia: 1,
  Trudna: 2,
}

export const PROMOTIONS: Promotion[] = [
  {
    id: 1,
    bank: 'ING',
    bankInitial: 'I',
    color: '#FF6200',
    category: 'Konta osobiste',
    title: '300 zł za konto w ING + 7% na oszczędnościowym',
    bonus: 300,
    deadlineDays: 5,
    deadlineLabel: 'zostało 5 dni',
    deadlineDate: '2026-08-31',
    verifiedAt: '2026-08-14',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 15,
    tags: ['+ konto oszcz. 7%', 'bezpłatne'],
    requirements: [
      'Załóż konto do 31.08',
      'Zrób 3 płatności kartą',
      'Zapewnij wpływ 1000 zł',
      'Zaloguj się do aplikacji',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 98,
    description:
      'Najpopularniejsza promocja miesiąca: 300 zł za założenie konta w ING + 7% na koncie oszczędnościowym. Konto i karta za 0 zł przy 3 płatnościach kartą i wpływie 1000 zł. Premia wypłacana w 2 transzach, bez wpływu na BIK.',
    haczyki: ['Wymagany wpływ wynagrodzenia', 'Karta darmowa tylko przy 300zł/mc'],
    comments: 24,
    featured: true,
    bezBIK: true,
    bezWplywu: true,
    roi: 1200,
  },
  {
    id: 2,
    bank: 'mBank',
    bankInitial: 'm',
    color: '#E30613',
    category: 'Konta osobiste',
    title: '500 zł za eKonto + 200 zł za polecenie',
    bonus: 500,
    deadlineDays: 2,
    deadlineLabel: 'zostały 2 dni',
    deadlineDate: '2026-08-29',
    verifiedAt: '2026-08-13',
    difficulty: 'Średnia',
    time: '1h',
    timeMinutes: 60,
    tags: ['+ polecenie 200zł', '500zł premii'],
    requirements: [
      'Załóż eKonto do 29.08',
      'Zrób 5 transakcji BLIK',
      'Zapewnij wpływ 1500zł',
      'Załóż mOkazje',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 95,
    description:
      '500 zł za eKonto w mBanku za proste warunki: transakcje BLIK i wpływ 1500 zł. Dodatkowo 200 zł za każde polecenie konta w programie PolecamBank. Bez sprawdzania BIK.',
    haczyki: ['Konieczne wyrażenie zgód marketingowych', 'Wpływy muszą być z zewnątrz'],
    comments: 31,
    featured: true,
    bezBIK: true,
    bezWplywu: false,
    roi: 500,
    audience:
      'Dla osób, które chcą szybko dostać premię za eKonto (do 500 zł) i dodatkowo zarobić 200 zł za każde polecenie banku znajomym w programie PolecamBank.',
    faqExtra: {
      q: 'Czym różni się ta promocja od eKonta z zyskiem do 1010 zł?',
      a: 'To dwa osobne programy. Ta oferta stawia na szybką premię 500 zł za same warunki aktywności (transakcje BLIK, wpływ 1500 zł) i nagradza polecanie — 200 zł za każdego znajomego w programie PolecamBank. Program „eKonto z zyskiem do 1010 zł" to rozbudowana edycja z premią rozłożoną na 5 miesięcy i wyższym progiem wpływu 2000 zł. Jeśli chcesz zarobić najwięcej, wybierz wariant 1010 zł; jeśli zależy Ci na szybkim bonusie i poleceniach — ta oferta.',
    },
  },
  {
    id: 3,
    bank: 'Santander',
    bankInitial: 'S',
    color: '#EC0000',
    category: 'Karty kredytowe',
    title: '400 zł za kartę kredytową + 0% prowizji',
    bonus: 400,
    deadlineDays: 12,
    deadlineLabel: 'zostało 12 dni',
    deadlineDate: '2026-09-10',
    verifiedAt: '2026-08-14',
    difficulty: 'Średnia',
    time: '1h',
    timeMinutes: 60,
    tags: ['brak opłat rok', 'cashback 3%'],
    requirements: [
      'Wnioskuj o kartę do 10.09',
      'Wydaj 1000zł w 60 dni',
      'Spłać w całości',
      'Aktywuj raty 0%',
    ],
    cost: 25,
    status: 'Aktywna',
    popularity: 88,
    description:
      '400 zł za kartę kredytową Santander bez prowizji przez rok — wydaj 1000 zł w 60 dni, spłać w całości i aktywuj raty 0%. 3% cashbacku i roczna opłata 0 zł przy minimalnym dochodzie 2500 zł.',
    haczyki: ['Sprawdzenie BIK', 'Wpływ na zdolność kredytową', 'Wymagany dochód 2500zł'],
    comments: 18,
    featured: true,
    bezBIK: false,
    bezWplywu: false,
    roi: 400,
  },
  {
    id: 4,
    bank: 'PKO',
    bankInitial: 'P',
    color: '#002F6C',
    category: 'Konta osobiste',
    title: '200 zł za Konto dla Młodych + Spotify 3mc',
    bonus: 200,
    deadlineDays: 20,
    deadlineLabel: 'zostało 20 dni',
    deadlineDate: '2026-09-15',
    verifiedAt: '2026-08-12',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 15,
    tags: ['dla <26 lat', '+ Spotify'],
    requirements: ['Załóż konto do 15.09', '1 płatność kartą', 'Zaloguj do IKO'],
    cost: 0,
    status: 'Aktywna',
    popularity: 82,
    description:
      '200 zł za Konto dla Młodych w PKO (do 26 lat) — wystarczy 1 płatność kartą i logowanie do IKO. Do tego 3 miesiące Spotify Premium gratis. Zero warunków dochodowych i zero sprawdzania BIK.',
    haczyki: ['Limit wieku 18-26'],
    comments: 9,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 800,
  },
  {
    id: 5,
    bank: 'Alior',
    bankInitial: 'A',
    color: '#7B1FA2',
    category: 'Konta firmowe',
    title: '600 zł za Konto Firmowe + terminal za 0zł',
    bonus: 600,
    deadlineDays: 8,
    deadlineLabel: 'zostało 8 dni',
    deadlineDate: '2026-08-24',
    verifiedAt: '2026-08-13',
    difficulty: 'Trudna',
    time: '3h+',
    timeMinutes: 180,
    tags: ['dla JDG', 'terminal gratis'],
    requirements: [
      'Załóż konto firmowe',
      'Zapewnij wpływ 2000zł',
      'Zrób 3 przelewy ZUS/US',
      'Utrzymaj konto 6mc',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 76,
    description:
      '600 zł premii za Konto Firmowe w Alior dla jednoosobowych działalności + terminal płatniczy za 0 zł. Wymaga wpływu 2000 zł, 3 przelewów ZUS/US i utrzymania konta przez 6 miesięcy.',
    haczyki: ['Wymagane prowadzenie JDG', 'Weryfikacja w oddziale'],
    comments: 15,
    featured: false,
    bezBIK: false,
    bezWplywu: false,
    roi: 200,
  },
  {
    id: 6,
    bank: 'BNP Paribas',
    bankInitial: 'B',
    color: '#00915A',
    category: 'Konta osobiste',
    title: '350 zł za Konto Otwarte na Ciebie',
    bonus: 350,
    deadlineDays: 1,
    deadlineLabel: 'ostatni dzień!',
    deadlineDate: '2026-08-27',
    verifiedAt: '2026-08-14',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 15,
    tags: ['GO 8% 3mc', 'bezpłatne'],
    requirements: ['Załóż do 27.08', '3 płatności BLIK', 'Wpływ 1000zł'],
    cost: 0,
    status: 'Aktywna',
    popularity: 91,
    description:
      '350 zł za Konto Otwarte na Ciebie w BNP Paribas — załóż konto, zrób 3 płatności BLIK i zapewnij wpływ 1000 zł. Do tego 8% na koncie oszczędnościowym przez 3 miesiące. Bez BIK, bez wpływu na zdolność kredytową.',
    haczyki: ['Konto musi być aktywne 12mc inaczej zwrot premii'],
    comments: 22,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 1400,
  },
  {
    id: 7,
    bank: 'Revolut',
    bankInitial: 'R',
    color: '#000000',
    category: 'Cashback',
    title: '50 zł cashback + karta metal za pół ceny',
    bonus: 50,
    deadlineDays: 30,
    deadlineLabel: 'zostało 30 dni',
    deadlineDate: '2026-09-15',
    verifiedAt: '2026-08-12',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 10,
    tags: ['+ 3% cashback', 'instant'],
    requirements: ['Załóż Revolut', 'Zrób płatność 50zł'],
    cost: 0,
    status: 'Aktywna',
    popularity: 85,
    description:
      '50 zł cashbacku w Revolut za płatność 50 zł po założeniu konta + karta metal za pół ceny i do 3% zwrotu za zakupy. Realizacja w 10 minut, bez formalności i bez sprawdzania BIK.',
    haczyki: ['Wymagana weryfikacja tożsamości'],
    comments: 42,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 300,
  },
  {
    id: 8,
    bank: 'Millennium',
    bankInitial: 'M',
    color: '#E30613',
    category: 'Oszczędnościowe',
    title: '250 zł za konto + 7,5% na 90 dni',
    bonus: 250,
    deadlineDays: 7,
    deadlineLabel: 'zostało 7 dni',
    deadlineDate: '2026-08-23',
    verifiedAt: '2026-08-12',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 20,
    tags: ['7,5% oszcz.', 'lokata 5%'],
    requirements: ['Załóż Konto 360°', 'Aktywuj oszczędnościowe', 'Wpłać 1000zł'],
    cost: 0,
    status: 'Aktywna',
    popularity: 79,
    description:
      '250 zł premii za Konto 360° w Millennium + 7,5% w skali roku na koncie oszczędnościowym przez 90 dni i lokata 5%. Załóż konto, wpłać 1000 zł i aktywuj oszczędnościowe. Bez BIK.',
    haczyki: ['Oprocentowanie promocyjne tylko 90 dni'],
    comments: 13,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 750,
  },
  {
    id: 9,
    bank: 'ING',
    bankInitial: 'I',
    color: '#FF6200',
    category: 'Karty kredytowe',
    title: '300 zł za kartę kredytową ING',
    bonus: 300,
    deadlineDays: 14,
    deadlineLabel: 'zostało 14 dni',
    deadlineDate: '2026-08-30',
    verifiedAt: '2026-08-13',
    difficulty: 'Średnia',
    time: '1h',
    timeMinutes: 45,
    tags: ['+ 300zł za przelewy', 'bez BIK? nie'],
    requirements: ['Wniosek online', 'Dochód min 2000zł', 'Wydaj 500zł'],
    cost: 0,
    status: 'Aktywna',
    popularity: 71,
    description:
      '300 zł za kartę kredytową ING — wniosek online, wydaj 500 zł i odbierz premię. Karta darmowa przez pierwszy rok, potem opłata 40 zł. Bank sprawdza BIK i wymaga dochodu min. 2000 zł.',
    haczyki: ['BIK, zdolność', 'Opłata po roku 40zł'],
    comments: 7,
    featured: false,
    bezBIK: false,
    bezWplywu: false,
    roi: 400,
  },
  {
    id: 10,
    bank: 'mBank',
    bankInitial: 'm',
    color: '#E30613',
    category: 'Ankiety/Aplikacje',
    title: '150 zł za aplikację mOkazje - zakupy',
    bonus: 150,
    deadlineDays: 25,
    deadlineLabel: 'zostało 25 dni',
    deadlineDate: '2026-09-10',
    verifiedAt: '2026-08-13',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 15,
    tags: ['cashback', 'aplikacja'],
    requirements: ['Zainstaluj aplikację', 'Zrób zakupy za 100zł'],
    cost: 0,
    status: 'Aktywna',
    popularity: 90,
    description:
      '150 zł za korzystanie z aplikacji mOkazje w mBanku — zainstaluj apkę i zrób zakupy za 100 zł u partnerów, żeby odebrać cashback. Realizacja w 15 minut, bez BIK i bez wpływu na zdolność kredytową.',
    haczyki: ['Zwroty tylko u partnerów'],
    comments: 28,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 600,
  },
  {
    id: 11,
    bank: 'Santander',
    bankInitial: 'S',
    color: '#EC0000',
    category: 'Polecenia',
    title: '100 zł za polecenie konta + 100 zł dla znajomego',
    bonus: 100,
    deadlineDays: 18,
    deadlineLabel: 'zostało 18 dni',
    deadlineDate: '2026-09-03',
    verifiedAt: '2026-08-14',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 15,
    tags: ['polecenie', 'win-win'],
    requirements: ['Poleć konto', 'Znajomy założy i zrobi 1 płatność'],
    cost: 0,
    status: 'Aktywna',
    popularity: 87,
    description:
      '100 zł za każde polecenie konta w Santander + 100 zł dla znajomego, który założy konto i zrobi 1 płatność. Maksymalnie 10 poleceń miesięcznie. Bez BIK.',
    haczyki: ['Maks 10 poleceń / miesiąc'],
    comments: 19,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 400,
  },
  {
    id: 12,
    bank: 'PKO',
    bankInitial: 'P',
    color: '#002F6C',
    category: 'Konta firmowe',
    title: '400 zł za konto firmowe PKO + księgowość 3mc free',
    bonus: 400,
    deadlineDays: 3,
    deadlineLabel: 'zostały 3 dni',
    deadlineDate: '2026-08-19',
    verifiedAt: '2026-08-13',
    difficulty: 'Trudna',
    time: '3h+',
    timeMinutes: 180,
    tags: ['JDG', 'księgowość'],
    requirements: ['Załóż konto firmowe', 'Wpływ 3000zł', 'Aktywuj terminal'],
    cost: 0,
    status: 'Aktywna',
    popularity: 68,
    description:
      '400 zł za konto firmowe PKO dla jednoosobowych działalności + 3 miesiące księgowości gratis. Wymaga wpływu 3000 zł i aktywacji terminala. Po 3 miesiącach konto kosztuje 30 zł/mies.',
    haczyki: ['Konto płatne 30zł po 3mc', 'Umowa 12mc'],
    comments: 11,
    featured: false,
    bezBIK: false,
    bezWplywu: false,
    roi: 133,
  },
  {
    id: 13,
    bank: 'Alior',
    bankInitial: 'A',
    color: '#7B1FA2',
    category: 'Oszczędnościowe',
    title: '300 zł za konto oszczędnościowe 7% + premia',
    bonus: 300,
    deadlineDays: 9,
    deadlineLabel: 'zostało 9 dni',
    deadlineDate: '2026-08-25',
    verifiedAt: '2026-08-12',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 20,
    tags: ['7% 4mc', 'elastyczne'],
    requirements: ['Załóż konto', 'Wpłać min 2000zł', 'Utrzymaj 3mc'],
    cost: 0,
    status: 'Aktywna',
    popularity: 77,
    description:
      '300 zł premii za konto oszczędnościowe w Alior z oprocentowaniem 7% przez 4 miesiące — wpłać min. 2000 zł i utrzymaj środki przez 3 miesiące. Limit wpłat do 100 000 zł. Bez BIK.',
    haczyki: ['Limit 100k'],
    comments: 16,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 900,
  },
  {
    id: 14,
    bank: 'BNP',
    bankInitial: 'B',
    color: '#00915A',
    category: 'Konta osobiste',
    title: '200 zł za konto + 50zł za kartę',
    bonus: 250,
    deadlineDays: 6,
    deadlineLabel: 'zostało 6 dni',
    deadlineDate: '2026-08-22',
    verifiedAt: '2026-08-13',
    difficulty: 'Średnia',
    time: '1h',
    timeMinutes: 40,
    tags: ['+ 50zł karta', 'GO 7%'],
    requirements: ['Załóż konto', 'Zamów kartę', 'Płatność kartą'],
    cost: 0,
    status: 'Aktywna',
    popularity: 73,
    description:
      '200 zł za konto w BNP + 50 zł za zamówienie karty — załóż konto, zamów kartę i zrób jedną płatność. Do tego 7% na koncie oszczędnościowym. Bez BIK.',
    haczyki: ['Karta 6zł/mc jeśli nieaktywna'],
    comments: 8,
    featured: false,
    bezBIK: true,
    bezWplywu: false,
    roi: 375,
  },
  {
    id: 15,
    bank: 'Revolut',
    bankInitial: 'R',
    color: '#000000',
    category: 'Ankiety/Aplikacje',
    title: '120 zł za ankiety i testy Revolut <18',
    bonus: 120,
    deadlineDays: 40,
    deadlineLabel: 'zostało 40 dni',
    deadlineDate: '2026-07-31',
    verifiedAt: '2026-07-31',
    difficulty: 'Łatwa',
    time: '1h',
    timeMinutes: 60,
    tags: ['dla młodych', 'ankiety'],
    requirements: ['Załóż Revolut Junior', 'Wypełnij 3 ankiety', 'Zaproś znajomego'],
    cost: 0,
    status: 'Archiwalna',
    popularity: 64,
    description:
      '120 zł za wypełnienie ankiet i testów w Revolut Junior — załóż konto, wypełnij 3 ankiety i zaproś znajomego. Promocja dla osób poniżej 18 lat, obecnie archiwalna (koniec programu).',
    haczyki: ['Tylko do 18 lat'],
    comments: 5,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 120,
  },
  {
    id: 16,
    bank: 'mBank',
    bankInitial: 'm',
    color: '#E30613',
    category: 'Konta osobiste',
    title: 'eKonto z zyskiem do 1010 zł',
    bonus: 1010,
    deadlineDays: 30,
    deadlineLabel: 'zostało 30 dni',
    deadlineDate: '2026-09-15',
    verifiedAt: '2026-08-14',
    difficulty: 'Średnia',
    time: '1h',
    timeMinutes: 60,
    tags: ['+5,3% na Moich celach', 'do 150 zł/polecenie'],
    requirements: [
      'Złóż wniosek przez selfie, e-dowód lub mObywatel',
      'Zrób transakcje kartą min. 350 zł w miesiącu',
      'Zapewnij wpływ min. 2000 zł i saldo 100 zł na Moich celach',
      'Utrzymaj warunki przez 5 kolejnych miesięcy',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 96,
    description:
      'Najwyższa premia mBanku w tym sezonie — do 1010 zł za otwarcie eKonta i aktywność. 5,3% w skali roku na rachunku Moje cele oraz do 150 zł za każde polecenie w programie PolecamBank.',
    haczyki: [
      'Premia rozbita na 5 miesięcy aktywności',
      'Bonus 300 zł tylko przy wpływie wynagrodzenia',
    ],
    comments: 28,
    featured: true,
    bezBIK: true,
    bezWplywu: true,
    roi: 600,
    audience:
      'Główny program eKonto mBanku — dla osób pełnoletnich, które mogą zapewnić wpływ 2000 zł i utrzymać aktywność przez 5 miesięcy, by zebrać pełną premię do 1010 zł.',
    faqExtra: {
      q: 'Czy premia 1010 zł wpływa od razu po otwarciu konta?',
      a: 'Nie — łączna premia składa się z kilku bonusów wypłacanych etapami: 10 zł za zapis do promocji i transakcję kartą, 100 zł (Premia I) po wpływie 2000 zł i pierwszym miesiącu aktywności, 400 zł (Premia II) po spełnieniu warunków w pięciu kolejnych miesiącach, do tego 100 zł za otwarcie konta przez selfie/e-dowód, 300 zł za wpływ wynagrodzenia i 100 zł za eKonto Junior dla dziecka. Pełną kwotę 1010 zł zbierzesz rozkładając aktywność na ok. 6–7 miesięcy — to najwyższy bonus mBanku w tym sezonie.',
    },
  },
  {
    id: 17,
    bank: 'mBank',
    bankInitial: 'm',
    color: '#E30613',
    category: 'Konta osobiste',
    title: 'eKonto dla młodych (18-24) do 910 zł',
    bonus: 910,
    deadlineDays: 30,
    deadlineLabel: 'zostało 30 dni',
    deadlineDate: '2026-09-15',
    verifiedAt: '2026-08-14',
    difficulty: 'Łatwa',
    time: '1h',
    timeMinutes: 45,
    tags: ['wiek 18-24', '5,3% oszcz.'],
    requirements: [
      'Załóż eKonto możliwości przez selfie lub mObywatel',
      'Zrób transakcje kartą min. 350 zł',
      'Zapewnij wpływ min. 1000 zł i saldo 100 zł na Moich celach',
      'Utrzymaj warunki przez 5 miesięcy',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 89,
    description:
      'Wersja eKonta dla osób 18–24. Niższe progi — wpływ 1000 zł zamiast 2000 zł — przy premii do 910 zł. 5,3% w skali roku na Moich celach.',
    haczyki: ['Warunek wieku 18–24 lata', 'Premia I 100 zł + Premia II 400 zł + bonusy'],
    comments: 14,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 500,
    audience:
      'Osobna edycja eKonta dla osób 18–24 lata: niższy próg wpływu (1000 zł zamiast 2000 zł) i niższe wymagania transakcyjne przy premii do 910 zł.',
    faqExtra: {
      q: 'Czym ta edycja dla młodych różni się od zwykłego eKonta z zyskiem do 1010 zł?',
      a: 'To dedykowany program dla osób w wieku 18–24 lata z łagodniejszymi warunkami: wystarczy wpływ 1000 zł miesięcznie (zamiast 2000 zł) i mniejsze wymagania transakcyjne, a łączna premia sięga 910 zł (100 zł za aktywność + 400 zł za utrzymanie warunków przez 5 miesięcy + bonusy za selfie/e-dowód, wpływy wynagrodzenia i konto dla dziecka). Pełnoletni powyżej 24. roku życia powinni wybrać standardowe eKonto z zyskiem do 1010 zł.',
    },
  },
  {
    id: 18,
    bank: 'mBank',
    bankInitial: 'm',
    color: '#E30613',
    category: 'Konta firmowe',
    title: 'Firmootwieracz + Konto mBiznes do 500 zł',
    bonus: 500,
    deadlineDays: 21,
    deadlineLabel: 'został 21 dni',
    deadlineDate: '2026-09-06',
    verifiedAt: '2026-08-13',
    difficulty: 'Średnia',
    time: '1h',
    timeMinutes: 60,
    tags: ['firma za 0 zł', 'karta Business WOŚP'],
    requirements: [
      'Załóż firmę i konto mBiznes w promocji „Załóż firmę”',
      'Zamów kartę Mastercard Debit Business lub WOŚP',
      'Wykonaj transakcje bezgotówkowe min. 1000 zł w 30 dni',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 74,
    description:
      'Premia do 500 zł dla nowych firm w mBanku. Konto mBiznes za 0 zł bezterminowo, 20 darmowych przelewów miesięcznie i 0 zł za mOrganizer przez 2 lata.',
    haczyki: [
      'Transakcje muszą być rozliczone w miesiącu',
      'Premia do końca następnego miesiąca po spełnieniu warunków',
    ],
    comments: 9,
    featured: false,
    bezBIK: false,
    bezWplywu: false,
    roi: 300,
  },
  {
    id: 19,
    bank: 'Nest Bank',
    bankInitial: 'N',
    color: '#0069B4',
    category: 'Konta osobiste',
    title: 'Nest Konto — premia do 1250 zł',
    bonus: 1250,
    deadlineDays: 30,
    deadlineLabel: 'zostało 30 dni',
    deadlineDate: '2026-09-15',
    verifiedAt: '2026-08-14',
    difficulty: 'Średnia',
    time: '3h+',
    timeMinutes: 120,
    tags: ['zwroty do 1200 zł', '6,1% lokata'],
    requirements: [
      'Otwórz Nest Konto z kartą VISA',
      'Zapewniaj wpływ min. 3000 zł miesięcznie (1500 zł dla 18–25)',
      'Wykonuj co miesiąc transakcję kartą lub BLIK',
      'Utrzymuj zgody marketingowe',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 92,
    description:
      'Do 1250 zł premii za aktywność: zwroty za płatności do 1200 zł przez 24 miesiące + 50 zł za wymianę waluty w Nest Kantor. Lokata 6,1% dla nowych klientów.',
    haczyki: [
      'Zwroty rozłożone na 24 miesiące',
      'Wymagany wpływ 3000 zł/mies.',
      'Bonus 50 zł tylko z kontem EUR',
    ],
    comments: 17,
    featured: true,
    bezBIK: true,
    bezWplywu: true,
    roi: 400,
  },
  {
    id: 20,
    bank: 'Nest Bank',
    bankInitial: 'N',
    color: '#0069B4',
    category: 'Konta firmowe',
    title: 'BIZnest Konto — premia do 3000 zł',
    bonus: 3000,
    deadlineDays: 30,
    deadlineLabel: 'zostało 30 dni',
    deadlineDate: '2026-09-15',
    verifiedAt: '2026-08-14',
    difficulty: 'Trudna',
    time: '3h+',
    timeMinutes: 180,
    tags: ['premia do 3000 zł', 'konto EUR gratis'],
    requirements: [
      'Załóż BIZnest Konto wraz z kontem walutowym EUR',
      'Wykonaj przewalutowania na określoną kwotę',
      'Utrzymaj saldo na koncie przez 3 miesiące',
      'Wyraź zgodę marketingową',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 70,
    description:
      'Premia do 3000 zł dla firm: od 50 do 1000 zł za przewalutowania i od 50 do 2000 zł za utrzymanie salda. Konto i pierwsza karta za 0 zł.',
    haczyki: ['Wymagane konto walutowe EUR', 'Warunki do spełnienia w 3 miesiące'],
    comments: 6,
    featured: false,
    bezBIK: false,
    bezWplywu: false,
    roi: 600,
  },
  {
    id: 21,
    bank: 'PKO',
    bankInitial: 'P',
    color: '#002F6C',
    category: 'Cashback',
    title: 'Konto Za Zero — 3% cashback na Allegro do 100 zł/mc',
    bonus: 100,
    bonusKind: 'monthly',
    deadlineDays: 60,
    deadlineLabel: 'zostało 60 dni',
    deadlineDate: '2026-10-15',
    verifiedAt: '2026-08-14',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 15,
    tags: ['3% na Allegro', 'Allegro Smart 6 mc za 1 zł'],
    requirements: [
      'Załóż Konto Za Zero i połącz z Allegro (Allegro Klik)',
      'Rób zakupy na Allegro i płać Allegro Klik',
      'Zapewnij wpływ min. 2000 zł miesięcznie dla cashbacku 2–3%',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 85,
    description:
      'Do 3% zwrotu za zakupy na Allegro (do 100 zł miesięcznie, do 1200 zł rocznie) + 6 miesięcy Allegro Smart! za 1 zł. Konto za 0 zł.',
    haczyki: [
      'Cashback 3% wymaga wpływu 2000 zł i produktu banku',
      'Allegro Smart! tylko raz przy pierwszym połączeniu',
    ],
    comments: 12,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 400,
  },
  {
    id: 22,
    bank: 'VeloBank',
    bankInitial: 'V',
    color: '#7A0C1F',
    category: 'Polecenia',
    title: 'VeloKonto — 100 zł za polecenie + do 50 zł/mc cashbacku',
    bonus: 100,
    deadlineDays: 45,
    deadlineLabel: 'zostało 45 dni',
    deadlineDate: '2026-09-30',
    verifiedAt: '2026-08-13',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 15,
    tags: ['100 zł za polecenie', 'VeloKorzyści'],
    requirements: [
      'Załóż VeloKonto (0 zł za prowadzenie)',
      'Poleć konto znajomemu',
      'Korzystaj z programu VeloKorzyści dla cashbacku',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 78,
    description:
      '100 zł za każde polecenie VeloKonta + do 50 zł miesięcznego cashbacku w programie VeloKorzyści (Max VeloKorzyści na Start). Konto za 0 zł bez warunków.',
    haczyki: [
      'Cashback zależny od aktywności w VeloKorzyści',
      'Pakiet medyczny odpłatny 36–138 zł/mc',
    ],
    comments: 8,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 400,
  },
  {
    id: 23,
    bank: 'VeloBank',
    bankInitial: 'V',
    color: '#7A0C1F',
    category: 'Oszczędnościowe',
    title: 'Elastyczne Konto Oszczędnościowe — 6% na nowe środki',
    bonus: 750,
    bonusKind: 'interest',
    deadlineDays: 30,
    deadlineLabel: 'zostało 30 dni',
    deadlineDate: '2026-09-15',
    verifiedAt: '2026-08-14',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 20,
    tags: ['6% do 50 tys. zł', '4% nadwyżka'],
    requirements: [
      'Otwórz Elastyczne Konto Oszczędnościowe online',
      'Wykonuj min. 5 transakcji bezgotówkowych kartą/BLIK miesięcznie',
      'Wpłać nowe środki (do 50 000 zł na 6%)',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 66,
    description:
      '6% w skali roku dla nowych środków do 50 000 zł (4% dla nadwyżki do 400 000 zł) przez 3 miesiące. Wymaga min. 5 transakcji bezgotówkowych w miesiącu. Wartość 750 zł to szacunkowy zysk z odsetek (6% × 50 000 zł przez 3 miesiące), a nie gotówkowa premia.',
    haczyki: [
      '6% tylko przy min. 5 transakcjach/mies.',
      'Oferta dla nowych klientów',
      'Po 3 miesiącach oprocentowanie podstawowe',
      '750 zł = szacunkowe odsetki, nie gotówkowa premia',
    ],
    comments: 4,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 200,
  },
  {
    id: 24,
    bank: 'Pekao',
    bankInitial: 'P',
    color: '#D71920',
    category: 'Konta osobiste',
    title: 'Konto Przekorzystne — 300 zł, nawet 2400 zł w promocji podróżnej',
    bonus: 300,
    deadlineDays: 17,
    deadlineLabel: 'zostało 17 dni',
    deadlineDate: '2026-09-02',
    verifiedAt: '2026-08-14',
    difficulty: 'Łatwa',
    time: '15min',
    timeMinutes: 15,
    tags: ['5,7% na oszcz.', '3% zwrotu za transakcje'],
    requirements: [
      'Otwórz Konto Przekorzystne z kartą online (selfie/AIS/PeoPay)',
      'Zaloguj się do Pekao24/PeoPay i wyraź zgody marketingowe',
      'Wykonaj min. 5 transakcji kartą w 2 miesiącach',
      'Opcjonalnie: płacenie złotą kartą dla zwrotów w promocji podróżnej',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 88,
    description:
      '300 zł za otwarcie i aktywność, a w Promocji Podróżnej nawet 2400 zł: 3% zwrotu za pierwsze 20 transakcji, 6% od 21. transakcji i 20% za wydatki podróżne. 5,7% na koncie oszczędnościowym.',
    haczyki: ['Promocja podróżna do 31.08.2026', 'Zwroty gromadzone w wirtualnym portfelu'],
    comments: 16,
    featured: false,
    bezBIK: true,
    bezWplywu: true,
    roi: 1200,
  },
  {
    id: 25,
    bank: 'Pekao',
    bankInitial: 'P',
    color: '#D71920',
    category: 'Konta firmowe',
    title: 'Konto Biznes z Żubrem — premia do 4200 zł',
    bonus: 4200,
    deadlineDays: 30,
    deadlineLabel: 'zostało 30 dni',
    deadlineDate: '2026-09-15',
    verifiedAt: '2026-08-14',
    difficulty: 'Trudna',
    time: '3h+',
    timeMinutes: 180,
    tags: ['premia do 4200 zł', '4% zwrotu za transakcje'],
    requirements: [
      'Załóż firmę z bankiem i zawrzyj umowę o konto z kartą Mastercard',
      'Wykonuj przelewy do ZUS min. 300 zł miesięcznie',
      'Płać kartą min. 500 zł miesięcznie (4% zwrotu, do 200 zł/mc)',
      'Opcjonalnie: terminal płatniczy i kredyt w rachunku',
    ],
    cost: 0,
    status: 'Aktywna',
    popularity: 81,
    description:
      'Do 4200 zł premii dla firm: 200 zł za założenie, do 2000 zł zwrotu za transakcje kartą (4% przez 10 miesięcy), 800 zł za terminal i 600 zł za kredyt w rachunku.',
    haczyki: [
      'Zwroty rozłożone na 10 miesięcy',
      'Wymagany przelew do ZUS co miesiąc',
      '4% tylko przy transakcjach min. 500 zł',
    ],
    comments: 11,
    featured: true,
    bezBIK: false,
    bezWplywu: false,
    roi: 800,
  },
]

// Uczciwa świeżość: deadline przeliczany z daty przy każdym buildzie, nie statyczny snapshot.
for (const promo of PROMOTIONS) {
  const { days, label } = deadlineFrom(promo.deadlineDate)
  promo.deadlineDays = days
  promo.deadlineLabel = label
}
