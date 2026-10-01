# Decyzje audytu — Hajsoholik.pl

## D-001 — `priceValidUntil` pomijany, gdy data minęła (2026-10-01)
**Kontekst:** 23/36 promocji miało w schema datę ważności ceny z przeszłości.
**Rozważane opcje:**
1. Zaktualizować `deadlineDate` w danych → kłamstwo o terminie promocji.
2. Zawsze ustawiać `priceValidUntil` na +1 rok → fikcyjna data, gorsze niż brak.
3. **Pomijać pole, gdy data minęła** ← wybrane.
**Uzasadnienie:** pole jest opcjonalne; brak pola to brak rich result, ale brak kłamstwa.
Opcja 1 i 2 zamieniają błąd techniczny na wprowadzanie użytkownika w błąd.
**Cena:** 23 strony bez `priceValidUntil` do czasu odświeżenia danych promocji.

## D-002 — `aggregateRating` usunięty, `Review` zostaje (2026-10-01)
**Kontekst:** 37 stron deklarowało agregat opinii, którego jedynym „głosem" była
deterministyczna ocena redakcji.
**Rozważane opcje:**
1. Zostawić — „inne serwisy tak robią".
2. Dodać prawdziwe opinie użytkowników → brak systemu zbierania opinii, wymaga pracy
   i realnych danych (reguła repo: zero dummy data).
3. **Usunąć `aggregateRating`, zostawić jawny `Review` redakcji** ← wybrane.
**Uzasadnienie:** `aggregateRating` znaczy „agregat opinii użytkowników". Użycie go do
oceny redakcyjnej to mylące i Google tego nie wyświetla. Uczciwy `Review` ekspercki
niesie tę samą informację bez podszywania się pod dowód społeczny.
**Cena:** brak gwiazdek w SERP (których i tak by nie było — self-serving).

## D-003 — Nie instaluję toolchainu, żeby naprawić Lighthouse (2026-10-01)
**Kontekst:** Lighthouse pada na `INVALID_URL`; Chrome headless działa.
**Decyzja:** CWV zostają **UNVERIFIED** i idą do backlogu jako `BLOKADA`.
**Uzasadnienie:** granica środowiskowa zakazuje instalacji runtime'ów i naprawy
środowiska. Lepiej oddać pole niezmierzone niż sfałszować pomiar albo złamać granicę.
