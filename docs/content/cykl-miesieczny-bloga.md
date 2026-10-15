# Cykl miesięczny bloga — „Najlepsze sposoby na zarobek: <miesiąc rok>"

Cel: powtarzalny, ~1-godzinny proces wydania miesięcznego. Outcome: regularny powód
powrotu dla czytelników i świeży content dla Google/AI w każdym miesiącu
(frazy „sposoby na zarobek <miesiąc>").

## Checklist wydania (pierwszy roboczy dzień miesiąca)

1. **Świeże dane:** `pnpm build` (sync Comperia + Astro + OG).
2. **Tabele:** `node scripts/blog-top-offerty.mjs 5` — wklej obie tabele do szkicu.
   Skrypt czyta `dist/llms.txt`, więc linki ZAWSZE prowadzą do opublikowanych ofert
   (zero martwych linków). Oferty z premią „do X zł" opisz z „do" (skrypt daje liczbę).
3. **Sekcje stałe:** krypto (2–3 oferty + zdanie o ryzyku), ankiety/aplikacje, cashback,
   „Na co uważać" (terminy → `/konczace-sie`, BIK → artykuł o BIK, wpływy).
4. **Data weryfikacji:** wstęp artykułu = najpóźniejszy `verifiedAt` z komentarza
   generatora; jeśli < 7 dni od dziś, zaktualizuj najpierw `verifiedAt` w danych ofert
   (weryfikacja u źródeł = otwarcie regulaminu, nie zmiana tekstu).
5. **Frontmatter:** nowy plik `najlepsze-sposoby-na-zarobek-<rrrr-mm>.md`
   (kolejny miesiąc = NOWY plik, nigdy edycja starego — stare wydania są archiwum SEO).
   `publishedAt` = 1. dzień miesiąca wydania, `verifiedAt` = z pkt 4.
6. **Bramki jakości:** zero obietnic zysku; każda kwota zgodna z danymi; linki tylko
   wewnętrzne (+ oficjalne źródła prawne); sekcja krypto z „nie jest poradą inwestycyjną".
7. **Kontrola martwych linków:** rebuild + skrypt z `docs/audit/completed.md`
   (porównanie `/promocja/<slug>` vs `dist/promocja/*/`).
8. **Publikacja:** `draft: false`, commit + push; deploy wg polityki (lokalnie → `--prebuilt --prod`).
9. **Stare wydanie:** w sekcji „Co dalej" poprzedniego wydania podmień link na bieżący
   miesiąc (soft redirect czytelnika, bez 301).

## Definicja „gotowe"

- `pnpm typecheck` / `pnpm lint` / `pnpm build` bez nowych błędów,
- 0 martwych linków, tytuł ≤62 zn., description ≤158 zn.,
- data weryfikacji ofert nie starsza niż 7 dni.
