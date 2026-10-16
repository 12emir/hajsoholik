/**
 * Biblioteka Sposobów Zarabiania — dedykowany moduł danych modeli dorabiania poza bankami.
 * Wzorowany na analizie rynkowej 2024-2026 oraz 3 koszykach dochodu IRS (Active, Passive, Portfolio).
 *
 * GWARANCJA BIZNESOWA:
 * 1. Oferty z aktywnym linkiem partnerskim (Bitget, Bybit) są zawsze prezentowane na początku.
 * 2. Oferty bez linka afiliacyjnego (lead magnety, platformy, metody niezależne) są pokazywane na końcu.
 */

import { CRYPTO_AFFILIATE_URLS } from './crypto-affiliates'

export type IncomeType = 'active' | 'passive' | 'portfolio'
export type SideHustleDifficulty = 'Łatwa' | 'Średnia' | 'Trudna'

export type SideHustleCategory =
  | 'Krypto & Fintech'
  | 'Ankiety & Testy'
  | 'Produkty cyfrowe'
  | 'AI & Automatyzacje'
  | 'Micro-SaaS'
  | 'Aktywa offline & Vending'
  | 'Usługi lokalne'
  | 'Reselling & Flipping'
  | 'Wiedza & Społeczność'

export interface SideHustle {
  id: string
  title: string
  platform: string
  platformInitial: string
  brandColor: string
  category: SideHustleCategory
  earningsDisplay: string
  bonusAmount: number
  roiPerHour: number
  difficulty: SideHustleDifficulty
  timeMinutes: number
  capitalRequired: number
  incomeType: IncomeType
  incomeTypeLabel: string
  tags: string[]
  requirements: string[]
  description: string
  haczyki: string[]
  affiliateUrl?: string
  hasAffiliateLink: boolean
  seoSlug: string
  targetUrl: string
}

export const SIDEHUSTLES: SideHustle[] = [
  // --- OFERTY Z PROGRAMEM PARTNERSKIM (PIERWSZE) ---
  {
    id: 'krypto_bitget_200usd',
    title: 'Bitget — bonus powitalny do 200$ za rejestrację i transakcje',
    platform: 'Bitget',
    platformInitial: 'B',
    brandColor: '#00F0FF',
    category: 'Krypto & Fintech',
    earningsDisplay: 'do 800 zł (200$)',
    bonusAmount: 800,
    roiPerHour: 1600,
    difficulty: 'Średnia',
    timeMinutes: 30,
    capitalRequired: 400,
    incomeType: 'portfolio',
    incomeTypeLabel: 'Portfelowy (giełda)',
    tags: ['KYC', 'bez BIK', 'wysokie ROI', 'premia na start'],
    requirements: [
      'Załóż konto przez oficjalny link polecający',
      'Przejdź podstawową weryfikację tożsamości (KYC)',
      'Wpłać depozyt min. 100$ i zrealizuj 1 transakcję na giełdzie',
    ],
    description:
      'Giełda Bitget oferuje program powitalny z bonusami transakcyjnymi i voucherami na copy-trading. Po spełnieniu warunków depozytu i obrotu nagrody wpływają na konto w sekcji nagród.',
    haczyki: [
      'Wymagana weryfikacja dowodem osobistym (KYC)',
      'Część bonusu to kupony na pokrycie opłat transakcyjnych futures',
      'Wypłata zysków wymaga zrealizowania minimalnego obrotu',
    ],
    affiliateUrl: CRYPTO_AFFILIATE_URLS[101],
    hasAffiliateLink: true,
    seoSlug: 'bitget-200usd-bonus',
    targetUrl: CRYPTO_AFFILIATE_URLS[101],
  },
  {
    id: 'krypto_bybit_5000',
    title: 'Bybit — pakiet bonusów powitalnych i nagród startowych',
    platform: 'Bybit',
    platformInitial: 'B',
    brandColor: '#F7A600',
    category: 'Krypto & Fintech',
    earningsDisplay: 'do 1200 zł (nagrody)',
    bonusAmount: 1200,
    roiPerHour: 1600,
    difficulty: 'Średnia',
    timeMinutes: 45,
    capitalRequired: 400,
    incomeType: 'portfolio',
    incomeTypeLabel: 'Portfelowy (giełda)',
    tags: ['KYC', 'bez BIK', 'trading', 'dla początkujących'],
    requirements: [
      'Zarejestruj się z linku partnerskiego',
      'Ukończ weryfikację tożsamości poziomu 1 (KYC)',
      'Dokonaj pierwszego depozytu 100$ i osiągnij wymagany wolumen obrotu',
    ],
    description:
      'Bybit to jedna z czołowych giełd kryptowalut z centrum nagród. Nowi użytkownicy otrzymują airdropy, zniżki na prowizje oraz gotówkowe bonusy za zadania wpłaty i handlu spot.',
    haczyki: [
      'Bonusy naliczane są w tokenach USDT lub voucherach tradingowych',
      'Większe kwoty wymagają większego wolumenu obrotu',
      'Kryptowaluty wiążą się z ryzykiem wahań kursowych',
    ],
    affiliateUrl: CRYPTO_AFFILIATE_URLS[104],
    hasAffiliateLink: true,
    seoSlug: 'bybit-bonus-5000',
    targetUrl: CRYPTO_AFFILIATE_URLS[104],
  },
  {
    id: 'fintech_revolut_200',
    title: 'Revolut — premia i cashback za założenie konta i 3 płatności',
    platform: 'Revolut',
    platformInitial: 'R',
    brandColor: '#0075EB',
    category: 'Krypto & Fintech',
    earningsDisplay: '200 zł premii',
    bonusAmount: 200,
    roiPerHour: 800,
    difficulty: 'Łatwa',
    timeMinutes: 15,
    capitalRequired: 0,
    incomeType: 'active',
    incomeTypeLabel: 'Aktywny (fintech)',
    tags: ['bez BIK', 'online 15min', 'błyskawiczna wypłata'],
    requirements: [
      'Pobierz aplikację i załóż bezpłatne konto Revolut',
      'Zasil konto kwotą min. 100 zł (kartą lub BLIKiem)',
      'Wykonaj 3 transakcje wirtualną lub fizyczną kartą na min. 30 zł',
    ],
    description:
      'Najpopularniejsza aplikacja finansowa w Europie. Oferuje wielowalutowe konto, cashback u partnerów i regularne akcje promocyjne. Realizacja formalności trwa kilkanaście minut.',
    haczyki: [
      'Płatności nie mogą być transakcjami hazardowymi ani przelewami peer-to-peer',
      'Wymagane jest zamówienie karty fizycznej lub dodanie wirtualnej do Apple/Google Pay',
    ],
    affiliateUrl: 'https://www.revolut.com/pl-PL/',
    hasAffiliateLink: true,
    seoSlug: 'revolut-200-zl-bonus',
    targetUrl: 'https://www.revolut.com/pl-PL/',
  },

  // --- OFERTY BEZ LINKA AFILIACYJNEGO (NA KOŃCU) ---
  {
    id: 'ankiety_prolific',
    title: 'Prolific — 30–60 zł/h za udział w badaniach naukowych i ankietach',
    platform: 'Prolific',
    platformInitial: 'P',
    brandColor: '#4F46E5',
    category: 'Ankiety & Testy',
    earningsDisplay: '120–400 zł/mc (30–60 zł/h)',
    bonusAmount: 120,
    roiPerHour: 45,
    difficulty: 'Łatwa',
    timeMinutes: 60,
    capitalRequired: 0,
    incomeType: 'active',
    incomeTypeLabel: 'Aktywny (czas)',
    tags: ['0 zł start', 'bez BIK', 'PayPal', 'praca zdalna'],
    requirements: [
      'Załóż bezpłatne konto na oficjalnej platformie Prolific',
      'Wypełnij sekcję "About You" w 100% (klucz do otrzymywania ankiet)',
      'Odpowiadaj na zaproszenia do badań 2–3 razy w tygodniu',
    ],
    description:
      'Najbardziej renomowana platforma ankiet akademickich na świecie. Badania zlecane są przez uniwersytety (m.in. Oxford, Stanford). Minimalna stawka wynosi 6 GBP/h, a wypłaty trafiają bezpośrednio na PayPal.',
    haczyki: [
      'Istnieje lista oczekujących na zatwierdzenie profilu (od kilku dni do paru tygodni)',
      'Wymagana wysoka dokładność — pytania kontrolne (attention checks) weryfikują skupienie',
      'Badania pojawiają się w określonych oknach czasowych i szybko się zapełniają',
    ],
    hasAffiliateLink: false,
    seoSlug: 'prolific-ankiety-placa-badania',
    targetUrl: 'https://www.prolific.com/',
  },
  {
    id: 'usertesting_10usd',
    title: 'UserTesting — 10$ (ok. 40 zł) za 15-minutowy test strony lub aplikacji',
    platform: 'UserTesting',
    platformInitial: 'UT',
    brandColor: '#0052CC',
    category: 'Ankiety & Testy',
    earningsDisplay: 'ok. 40 zł / test (160 zł/h)',
    bonusAmount: 40,
    roiPerHour: 160,
    difficulty: 'Łatwa',
    timeMinutes: 15,
    capitalRequired: 0,
    incomeType: 'active',
    incomeTypeLabel: 'Aktywny (czas)',
    tags: ['angielski B1', 'PayPal', '0 zł start', 'praca z domu'],
    requirements: [
      'Zarejestruj się jako tester na UserTesting z mikrofonem',
      'Przejdź krótki próbny test weryfikacyjny (mówienie na głos przy obsłudze strony)',
      'Odbieraj testy z dashboardu i zgarniaj 10$ za każde 10-15 minut',
    ],
    description:
      'Globalna platforma badań użyteczności UX. Firmy płacą użytkownikom za nagranie ekranu i głośne komentowanie swoich wrażeń podczas wykonywania prostych zadań na stronie lub w aplikacji.',
    haczyki: [
      'Konieczna podstawowa znajomość języka angielskiego w mowie (poziom B1)',
      'Każdy test poprzedzony jest krótkim filtrem kwalifikacyjnym (tzw. screener)',
      'Wypłaty trafiają na konto PayPal dokładnie po 7 dniach od zatwierdzenia',
    ],
    hasAffiliateLink: false,
    seoSlug: 'usertesting-zarabianie-testowanie-stron',
    targetUrl: 'https://www.usertesting.com/',
  },
  {
    id: 'vinted_flipping',
    title: 'Vinted Flipping — 300–800 zł/mc ze sprzedaży nienoszonych ubrań i okazji',
    platform: 'Vinted',
    platformInitial: 'V',
    brandColor: '#09B1BA',
    category: 'Reselling & Flipping',
    earningsDisplay: '300–800 zł/mc',
    bonusAmount: 500,
    roiPerHour: 100,
    difficulty: 'Łatwa',
    timeMinutes: 180,
    capitalRequired: 0,
    incomeType: 'active',
    incomeTypeLabel: 'Aktywny (handel)',
    tags: ['0 zł start', 'bez BIK', 'odporne na recesję', 'szybki cash'],
    requirements: [
      'Przejrzyj szafę i wyselekcjonuj min. 20 markowych, nieużywanych rzeczy',
      'Zrób jasne zdjęcia na neutralnym tle i podaj precyzyjne wymiary',
      'Wysyłaj paczki w ciągu 24–48h przez Paczkomaty',
    ],
    description:
      'Rynek second-hand w Polsce przeżywa boom. Sprzedaż zalegających ubrań, butów i elektroniki to najprostszy sposób na pozyskanie wolnej gotówki w 48 godzin bez żadnego wkładu finansowego.',
    haczyki: [
      'Kupujący często negocjują ceny i zadają dodatkowe pytania',
      'Konieczność przestrzegania limitów transakcji DAC7 (do 30 transakcji lub 2000 EUR rocznie)',
      'Pakowanie i wysyłka wymagają systematyczności',
    ],
    hasAffiliateLink: false,
    seoSlug: 'vinted-flipping-jak-zarabiac',
    targetUrl: 'https://www.vinted.pl/',
  },
  {
    id: 'notion_template',
    title: 'Szablony Notion — 200–2000 zł/mc ze sprzedaży produktów cyfrowych',
    platform: 'Gumroad',
    platformInitial: 'G',
    brandColor: '#FF90E8',
    category: 'Produkty cyfrowe',
    earningsDisplay: '200–2000 zł/mc',
    bonusAmount: 700,
    roiPerHour: 350,
    difficulty: 'Średnia',
    timeMinutes: 480,
    capitalRequired: 0,
    incomeType: 'passive',
    incomeTypeLabel: 'Pasywny (produkt cyfrowy)',
    tags: ['produkt cyfrowy', 'pasywny', '90% marża', '0 zł start'],
    requirements: [
      'Zbuduj estetyczny i użyteczny szablon Notion (np. habit tracker, budżet domowy, CRM)',
      'Przygotuj okładkę w Canvie i wystaw produkt bezpłatnie na Gumroad lub Etsy',
      'Udostępnij link na grupach Notion, TikToku i r/Notion',
    ],
    description:
      'Jeden z najlepiej udokumentowanych side-hustli 2024–2026. Raz zbudowany szablon sprzedaje się setki razy bez konieczności magazynowania towaru, generując marżę rzędu 90%+ po potrąceniu prowizji platformy.',
    haczyki: [
      'Wymaga opanowania narzędzia Notion na poziomie tworzenia relacyjnych baz danych',
      'Kluczem do sprzedaży jest dystrybucja i budowanie małej społeczności w mediach społecznościowych',
      'Gumroad pobiera 10% prowizji od każdej udanej transakcji',
    ],
    hasAffiliateLink: false,
    seoSlug: 'szablony-notion-zarabianie',
    targetUrl: 'https://gumroad.com/',
  },
  {
    id: 'etsy_printables',
    title: 'Printables na Etsy — 300–1500 zł/mc z cyfrowych plannerów i arkuszy',
    platform: 'Etsy',
    platformInitial: 'E',
    brandColor: '#F16521',
    category: 'Produkty cyfrowe',
    earningsDisplay: '300–1500 zł/mc',
    bonusAmount: 1200,
    roiPerHour: 150,
    difficulty: 'Łatwa',
    timeMinutes: 300,
    capitalRequired: 0,
    incomeType: 'passive',
    incomeTypeLabel: 'Pasywny (produkt cyfrowy)',
    tags: ['Canva', 'pasywny', '0 zł start', 'wysoka marża'],
    requirements: [
      'Zaprojektuj w darmowej Canvie serię plannerów (ślubne, budżetowe, organizacja nauki)',
      'Wyeksportuj pliki do formatu PDF do druku i dodaj do sklepu Etsy',
      'Dobierz słowa kluczowe pod algorytm wyszukiwarki Etsy (SEO)',
    ],
    description:
      'Klienci kupują plik cyfrowy, który drukują samodzielnie w domu. Brak kosztów produkcji, magazynowania czy wysyłki kurierskiej. Sprzedaż działa całkowicie automatycznie przez 24 godziny na dobę.',
    haczyki: [
      'Opłata za wystawienie oferty na Etsy wynosi ok. 0,20 USD za produkt na 4 miesiące',
      'Duża konkurencja w ogólnych kategoriach — wymaga celowania w niszowe potrzeby',
      'Sezonowość: najwyższe zarobki przypadają na styczeń (Nowy Rok) i wrzesień',
    ],
    hasAffiliateLink: false,
    seoSlug: 'etsy-printables-jak-zaczac',
    targetUrl: 'https://www.etsy.com/',
  },
  {
    id: 'ai_automation_agency',
    title: 'AI Automation Agency — 2000–8000 zł/mc stałego abonamentu dla firm',
    platform: 'AI Agency',
    platformInitial: 'AI',
    brandColor: '#8B5CF6',
    category: 'AI & Automatyzacje',
    earningsDisplay: '2000–8000 zł/mc retainer',
    bonusAmount: 3000,
    roiPerHour: 500,
    difficulty: 'Trudna',
    timeMinutes: 1200,
    capitalRequired: 200,
    incomeType: 'passive',
    incomeTypeLabel: 'Pasywny / B2B Retainer',
    tags: ['B2B', 'retainer', 'AI', 'wysoka marża'],
    requirements: [
      'Opanuj platformy Make.com, Voiceflow lub n8n',
      'Zbuduj działające demo (np. inteligentna recepcjonistka AI na stronę salonu beauty)',
      'Zaoferuj lokalnym firmom wdrożenie za 1000 zł + miesięczne utrzymanie 497 zł/mc',
    ],
    description:
      'Najszybciej rosnąca kategoria usług w latach 2025–2026. Małe firmy nie mają czasu na wdrażanie modeli AI, ale chętnie płacą miesięczny abonament za automatyczne odpowiadanie na zapytania klientów i umawianie wizyt.',
    haczyki: [
      'Wymaga umiejętności sprzedaży bezpośredniej B2B i rozmowy z właścicielami firm',
      'Konieczność dbania o bezawaryjność automatyzacji i limity tokenów API',
      'Wyższy próg wejścia technologicznego niż przy prostych ankietach',
    ],
    hasAffiliateLink: false,
    seoSlug: 'ai-automation-agency-jak-zaczac',
    targetUrl: 'https://make.com/',
  },
  {
    id: 'micro_saas_shopify',
    title: 'Micro-SaaS — aplikacja w Shopify App Store w modelu subskrypcji',
    platform: 'Shopify',
    platformInitial: 'S',
    brandColor: '#95BF47',
    category: 'Micro-SaaS',
    earningsDisplay: '1000–12000 zł/mc MRR',
    bonusAmount: 4000,
    roiPerHour: 400,
    difficulty: 'Trudna',
    timeMinutes: 2400,
    capitalRequired: 500,
    incomeType: 'passive',
    incomeTypeLabel: 'Pasywny (MRR)',
    tags: ['SaaS', 'MRR', 'pasywny', 'globalny rynek'],
    requirements: [
      'Znajdź powtarzalny problem sklepów online (np. kopie zapasowe, powiadomienia SMS)',
      'Zbuduj małą aplikację w Next.js lub rozwiązaniach no-code',
      'Opublikuj narzędzie w Shopify App Store z miesięcznym planem 19–49 $/mc',
    ],
    description:
      'Micro-SaaS rozwiązuje jedno konkretne zadanie. Właściciele sklepów internetowych płacą comiesięczną subskrypcję, co przekłada się na stabilny, powtarzalny dochód (MRR) odporny na zawirowania rynkowe.',
    haczyki: [
      'Wymaga umiejętności programistycznych lub zaawansowanego no-code',
      'Shopify weryfikuje aplikacje pod kątem bezpieczeństwa i zgodności z API',
      'Konieczność zapewnienia wsparcia technicznego dla użytkowników',
    ],
    hasAffiliateLink: false,
    seoSlug: 'micro-saas-shopify-backup',
    targetUrl: 'https://apps.shopify.com/',
  },
  {
    id: 'vending_machine',
    title: 'Automat vendingowy — 300–800 zł/mc zysku netto z jednej maszyny',
    platform: 'Vending',
    platformInitial: 'V',
    brandColor: '#10B981',
    category: 'Aktywa offline & Vending',
    earningsDisplay: '300–800 zł/mc per maszyna',
    bonusAmount: 500,
    roiPerHour: 80,
    difficulty: 'Średnia',
    timeMinutes: 600,
    capitalRequired: 2000,
    incomeType: 'passive',
    incomeTypeLabel: 'Pasywny (fizyczny asset)',
    tags: ['offline', 'pasywny', 'odporny na recesję', 'fizyczny asset'],
    requirements: [
      'Kup używany, sprawny automat z przekąskami lub kawą (1500–2500 zł)',
      'Wynajmij lokalizację o dużym natężeniu ruchu (siłownia, warsztat, biurowiec)',
      'Uzupełniaj towar i opróżniaj kasetkę 1–2 razy w tygodniu',
    ],
    description:
      'Klasyczny "nudny biznes", który przynosi zyski bez względu na koniunkturę giełdową. Jedna dobrze zlokalizowana maszyna generuje stały cash-flow, a zyski z pierwszego automatu można reinwestować w kolejne.',
    haczyki: [
      'Kluczem do sukcesu jest lokalizacja — w złym punkcie obroty nie pokryją prądu i czynszu',
      'Automaty wymagają regularnego czyszczenia i serwisu mechanicznego',
      'Konieczność założenia działalności gospodarczej lub rozliczania działalności nierejestrowanej',
    ],
    hasAffiliateLink: false,
    seoSlug: 'automat-vendingowy-zarabianie',
    targetUrl: 'https://www.olx.pl/d/oferty/q-automat-vendingowy/',
  },
  {
    id: 'bookkeeping',
    title: 'Księgowość dla JDG — 500–2000 zł/mc od każdego stałego klienta',
    platform: 'Księgowość',
    platformInitial: 'K',
    brandColor: '#3B82F6',
    category: 'Usługi lokalne',
    earningsDisplay: '500–2000 zł/mc per klient',
    bonusAmount: 1000,
    roiPerHour: 200,
    difficulty: 'Średnia',
    timeMinutes: 120,
    capitalRequired: 300,
    incomeType: 'active',
    incomeTypeLabel: 'Aktywny (abonament B2B)',
    tags: ['B2B', 'abonament', 'odporny na recesję', 'stały dochód'],
    requirements: [
      'Opanuj rozliczenia KPiR i ryczałtu w programach takich jak wFirma lub InFakt',
      'Pozyskaj pierwszych 2–3 klientów z poleceń lub grup przedsiębiorców',
      'Prowadź comiesięczne księgowanie i wysyłaj pliki JPK do urzędu',
    ],
    description:
      'Każdy przedsiębiorca musi rozliczać podatki co miesiąc. Prowadzenie uproszczonej księgowości dla mikroprzedsiębiorców to stabilny model abonamentowy — raz pozyskany klient zostaje na lata.',
    haczyki: [
      'Odpowiedzialność za poprawność rozliczeń i terminy urzędowe',
      'Konieczność śledzenia dynamicznie zmieniających się przepisów podatkowych',
      'Wymagane ubezpieczenie OC biura rachunkowego przy większej skali',
    ],
    hasAffiliateLink: false,
    seoSlug: 'ksiegowosc-dla-jdg-jak-zaczac',
    targetUrl: 'https://wfirma.pl/',
  },
  {
    id: 'mobile_detailing',
    title: 'Mobilne mycie i detailing aut — 80–150 zł/h na dojeździe do klienta',
    platform: 'Detailing',
    platformInitial: 'D',
    brandColor: '#6366F1',
    category: 'Usługi lokalne',
    earningsDisplay: '80–150 zł/h (od ręki)',
    bonusAmount: 400,
    roiPerHour: 120,
    difficulty: 'Łatwa',
    timeMinutes: 240,
    capitalRequired: 500,
    incomeType: 'active',
    incomeTypeLabel: 'Aktywny (usługa)',
    tags: ['offline', 'weekend', 'niski start', 'gotówka od ręki'],
    requirements: [
      'Kup zestaw chemii detailingowej, mikrofibry i odkurzacz piorący (ok. 500 zł)',
      'Opublikuj ogłoszenia na lokalnych grupach osiedlowych i OLX',
      'Wykonuj zlecenia mycia i czyszczenia tapicerki na podjeździe u klienta',
    ],
    description:
      'Klienci nie mają czasu jeździć na myjnie ręczne. Usługa z dojazdem pod dom lub pod biurowiec cieszy się ogromnym popytem, a zadowoleni klienci zamawiają regularne czyszczenie co 1–2 miesiące.',
    haczyki: [
      'Praca fizyczna zależna od warunków pogodowych (sezon wiosna–jesień)',
      'Konieczność dostępu do prądu i wody na posesji klienta lub posiadania własnego zasilania',
      'Wymagana staranność, by nie porysować lakieru klienta',
    ],
    hasAffiliateLink: false,
    seoSlug: 'mobilne-mycie-aut-biznes',
    targetUrl: 'https://www.olx.pl/uslugi/motoryzacja/',
  },
  {
    id: 'rental_parking',
    title: 'Wynajem miejsca parkingowego — 150–400 zł/mc czystego dochodu pasywnego',
    platform: 'Parking',
    platformInitial: 'P',
    brandColor: '#64748B',
    category: 'Aktywa offline & Vending',
    earningsDisplay: '150–400 zł/mc',
    bonusAmount: 250,
    roiPerHour: 500,
    difficulty: 'Łatwa',
    timeMinutes: 30,
    capitalRequired: 0,
    incomeType: 'passive',
    incomeTypeLabel: 'Pasywny (najem)',
    tags: ['0 zł start', 'pasywny', 'odporny na recesję', 'zero obsługi'],
    requirements: [
      'Przeznacz wolne miejsce w hali garażowej lub boks, z którego nie korzystasz',
      'Wystaw ofertę na OLX i na grupie mieszkańców osiedla',
      'Podpisz prostą umowę najmu z kaucją za pilota/kartę wjazdową',
    ],
    description:
      'Najmniej angażujący model najmu na rynku nieruchomości. Brak zużycia sprzętu, brak ryzyka zniszczeń mieszkania, a pieniądze wpływają na konto 1. dnia każdego miesiąca.',
    haczyki: [
      'Wymaga posiadania wolnego miejsca przypisanego do lokalu lub na własność',
      'W niektórych wspólnotach wynajem osobom spoza osiedla wymaga zgłoszenia',
      'Konieczność rozliczenia ryczałtu od przychodów z najmu (8,5%)',
    ],
    hasAffiliateLink: false,
    seoSlug: 'wynajem-miejsca-parkingowego',
    targetUrl: 'https://www.olx.pl/nieruchomosci/garaze-parkingi/',
  },
  {
    id: 'domain_flipping',
    title: 'Flipping domen internetowych — 200–2000 zł marży na pojedynczej transakcji',
    platform: 'Aftermarket',
    platformInitial: 'A',
    brandColor: '#F59E0B',
    category: 'Reselling & Flipping',
    earningsDisplay: '200–2000 zł per flip',
    bonusAmount: 500,
    roiPerHour: 250,
    difficulty: 'Średnia',
    timeMinutes: 180,
    capitalRequired: 100,
    incomeType: 'active',
    incomeTypeLabel: 'Aktywny (arbitraż)',
    tags: ['domena', 'Aftermarket.pl', 'arbitraż', 'online'],
    requirements: [
      'Wyszukuj wygasające domeny .pl z historią i ruchem na Aftermarket.pl',
      'Rejestruj obiecujące adresy branżowe (np. pod usługi lokalne, e-commerce)',
      'Wystawiaj domeny na giełdzie z opcją natychmiastowego zakupu (Kup Teraz)',
    ],
    description:
      'Handel domenami polega na rejestracji atrakcyjnych nazw i odsprzedawaniu ich firmom wchodzącym na rynek. Przy koszcie rejestracji 15–50 zł, udana sprzedaż przynosi często 500–2500 zł czystego zysku.',
    haczyki: [
      'Nie każda zarejestrowana domena znajdzie nabywcę — część trzeba odnowić lub porzucić',
      'Wymaga cierpliwości: sprzedaż potrafi zająć od paru tygodni do kilku miesięcy',
      'Należy bezwzględnie unikać znaków towarowych znanych marek (ryzyko sporów prawnych)',
    ],
    hasAffiliateLink: false,
    seoSlug: 'flipping-domen-jak-zarabiac',
    targetUrl: 'https://www.aftermarket.pl/',
  },
  {
    id: 'paid_community',
    title: 'Płatna społeczność na Skool — model subskrypcyjny 19–49$ per członek',
    platform: 'Skool',
    platformInitial: 'S',
    brandColor: '#EC4899',
    category: 'Wiedza & Społeczność',
    earningsDisplay: '1000–5000 zł/mc MRR',
    bonusAmount: 2000,
    roiPerHour: 300,
    difficulty: 'Trudna',
    timeMinutes: 1800,
    capitalRequired: 400,
    incomeType: 'passive',
    incomeTypeLabel: 'Pasywny (MRR)',
    tags: ['community', 'MRR', 'ekspert', 'subskrypcja'],
    requirements: [
      'Wybierz niszowy temat, w którym masz praktyczną wiedzę (finanse, programowanie, fitness)',
      'Zaproś pierwszych 20–50 członków bezpłatnie i dostarczaj regularne materiały',
      'Wprowadź miesięczną opłatę subskrypcyjną (np. 19–49 $/mc) po uzyskaniu zaangażowania',
    ],
    description:
      'Społeczności subskrypcyjne na Skool to rewolucja w monetyzacji wiedzy. Łączą kursy z dyskusjami i grywalizacją. Grupa zaledwie 30 płacących członków generuje od 2500 do 6000 zł powtarzalnego przychodu miesięcznie.',
    haczyki: [
      'Utrzymanie subskrybentów wymaga stałej moderacji i regularnych spotkań Q&A',
      'Platforma Skool kosztuje 99 $/mc — wymaga szybkiego pozyskania min. 3–5 płatnych członków',
      'Konieczność budowania zaufania i realnej wartości merytorycznej',
    ],
    hasAffiliateLink: false,
    seoSlug: 'platna-spolecznosc-skool',
    targetUrl: 'https://www.skool.com/',
  },
]

/**
 * Zwraca oferty posortowane wg twardego wymogu biznesowego:
 * 1. Oferty z aktywnym linkiem partnerskim (Bitget, Bybit, Revolut) NA POCZĄTKU.
 * 2. Oferty bez linka afiliacyjnego (Prolific, Notion, Vending itp.) NA KOŃCU.
 * 3. Wewnątrz grup: sortowanie po najwyższym ROI/h.
 */
export function getSortedSidehustles(): SideHustle[] {
  return [...SIDEHUSTLES].sort((a, b) => {
    if (a.hasAffiliateLink && !b.hasAffiliateLink) return -1
    if (!a.hasAffiliateLink && b.hasAffiliateLink) return 1
    return b.roiPerHour - a.roiPerHour
  })
}
