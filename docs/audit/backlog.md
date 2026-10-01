# Backlog audytu — Hajsoholik.pl

| ID | Typ | Priorytet | Co | Warunek wejścia |
|---|---|---|---|---|
| SEO-004 | FIX | P2 | Dodać `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, `permissions-policy` | Osobny task — zmiana nagłówków globalnych wymaga pełnej regresji |
| SEO-003 | DECYZJA | P2 | `site.updatedAt` = `2026-08-14` mimo zmian w październiku | Decyzja właściciela: data redakcyjna czy zapomniane pole |
| MISS-001 | IDEA | P1 | Odtworzyć brakujące strony: `/poradnik/latwe-promocje-bez-bik`, `/bank/mbank`, `/o-redakcji`, `/polityka-cookies` | Linki już usunięte (nie ma 404). Strony wymagają treści — zero dummy data. Właściciel decyduje, które wracają |
| PERF-001 | BLOKADA | P2 | Pomiar Lighthouse/CWV | **Zablokowane**: Lighthouse w tym środowisku kończy się `INVALID_URL`; instalacja toolchainu zakazana |

## Reguły backlogu
- `FIX` — konkretna zmiana, znany plik, można wziąć od razu.
- `DECYZJA` — wymaga odpowiedzi właściciela, agent nie zgaduje.
- `IDEA` — pomysł produktowy; nie implementowany w trakcie audytu.
- `BLOKADA` — nie da się ruszyć w obecnym środowisku; wymaga zmiany po stronie człowieka.
