/**
 * HajsoholikApp — główny interaktywny island React.
 * Stan lokalny (filtry, sort, zapisane, postęp wymagań) — standard Apple-tier.
 */
import { useEffect, useMemo, useState } from 'react'

import { ChevronDown, SlidersHorizontal } from 'lucide-react'

import { PROMOTIONS, type Promotion, slugify, statusOf } from '@/data/promotions'
import { FeaturedCard } from './cards/FeaturedCard'
import { PromotionCard } from './cards/PromotionCard'
import { DetailModal } from './detail/DetailModal'
import { SidebarFilters } from './filters/SidebarFilters'
import { PROGRESS_KEY } from './progress-storage'

const SORT_OPTIONS = [
  'Najwyższa premia',
  'Najlepsze ROI/h',
  'Najłatwiejsza',
  'Kończy się najszybciej',
  'Popularność',
] as const

type SortOption = (typeof SORT_OPTIONS)[number]

const DIFF_ORDER: Record<string, number> = { Łatwa: 0, Średnia: 1, Trudna: 2 }

const CATEGORY_QUERY: Record<string, string> = {
  'konta-osobiste': 'Konta osobiste',
  'konta-firmowe': 'Konta firmowe',
  'karty-kredytowe': 'Karty kredytowe',
  oszczednosciowe: 'Oszczędnościowe',
  polecenia: 'Polecenia',
  cashback: 'Cashback',
  'ankiety-aplikacje': 'Ankiety/Aplikacje',
}

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export default function HajsoholikApp({ buildNow }: { buildNow: string }) {
  // „Teraz" startuje z datą builda (identycznie jak SSR → brak hydration mismatch),
  // a po zamontowaniu przeskakuje na prawdziwą datę użytkownika.
  const [now, setNow] = useState(() => new Date(`${buildNow}T12:00:00+02:00`))

  useEffect(() => {
    setNow(new Date())
  }, [])

  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    const param = new URLSearchParams(window.location.search).get('kategoria')
    return param && CATEGORY_QUERY[param] ? [CATEGORY_QUERY[param]] : []
  })
  const [banks, setBanks] = useState<string[]>([])
  const [minBonus, setMinBonus] = useState(0)
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [times, setTimes] = useState<string[]>([])
  const [statuses, setStatuses] = useState<string[]>(['Aktywna', 'Kończy się w 48h'])
  const [onlyNoBIK, setOnlyNoBIK] = useState(false)
  const [noCreditImpact, setNoCreditImpact] = useState(false)
  const [sort, setSort] = useState<SortOption>('Najwyższa premia')
  const [saved, setSaved] = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<Promotion | null>(() => {
    if (typeof window === 'undefined') return null
    const slug = new URLSearchParams(window.location.search).get('promocja')
    if (!slug) return null
    return PROMOTIONS.find((p) => slugify(p.title) === slug) ?? null
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [progress, setProgress] = useState<Record<number, boolean[]>>(() => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_KEY)
      return raw ? (JSON.parse(raw) as Record<number, boolean[]>) : {}
    } catch {
      return {}
    }
  })
  const [costInput, setCostInput] = useState(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    } catch {
      // localStorage niedostępny — ignoruj
    }
  }, [progress])

  const filtered = useMemo(() => {
    const result = PROMOTIONS.filter((p) => {
      if (
        query &&
        !`${p.title} ${p.bank} ${p.category}`.toLowerCase().includes(query.toLowerCase())
      )
        return false
      if (categories.length && !categories.includes(p.category)) return false
      if (banks.length && !banks.some((b) => p.bank.toLowerCase().includes(b.toLowerCase())))
        return false
      if (p.bonus < minBonus) return false
      if (difficulties.length && !difficulties.includes(p.difficulty)) return false
      if (times.length && !times.includes(p.time)) return false
      if (statuses.length && !statuses.includes(statusOf(p.deadlineDate, now))) return false
      if (onlyNoBIK && !p.bezBIK) return false
      if (noCreditImpact && !p.bezWplywu) return false
      return true
    })

    return [...result].sort((a, b) => {
      switch (sort) {
        case 'Najwyższa premia':
          return b.bonus - a.bonus
        case 'Najlepsze ROI/h':
          return b.roi - a.roi
        case 'Najłatwiejsza':
          return (DIFF_ORDER[a.difficulty] ?? 0) - (DIFF_ORDER[b.difficulty] ?? 0)
        case 'Kończy się najszybciej':
          return a.deadlineDate.localeCompare(b.deadlineDate)
        case 'Popularność':
          return b.popularity - a.popularity
        default:
          return 0
      }
    })
  }, [
    query,
    categories,
    banks,
    minBonus,
    difficulties,
    times,
    statuses,
    onlyNoBIK,
    noCreditImpact,
    sort,
    now,
  ])

  // TOP 3 tylko gdy nie ma wąskich filtrów
  const featured = useMemo(() => {
    if (categories.length || banks.length || minBonus > 0 || query) return []
    return filtered.filter((p) => p.featured).slice(0, 3)
  }, [filtered, categories, banks, minBonus, query])

  // Karty bez duplikatów z Featured
  const feed = useMemo(() => {
    const featuredIds = new Set(featured.map((p) => p.id))
    return filtered.filter((p) => !featuredIds.has(p.id))
  }, [filtered, featured])

  const clearAll = () => {
    setCategories([])
    setBanks([])
    setMinBonus(0)
    setDifficulties([])
    setTimes([])
    setStatuses([])
    setOnlyNoBIK(false)
    setNoCreditImpact(false)
    setQuery('')
  }

  const toggleSaved = (id: number) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-zinc-900 font-sans antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:rounded-full focus:shadow-lg"
      >
        Przejdź do treści
      </a>

      <main
        id="main-content"
        className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8"
      >
        <h1 className="sr-only">
          Promocje bankowe 2026 — porównywarka premii za konto, kartę i lokatę
        </h1>
        <aside
          id="mobile-filters"
          className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[300px] shrink-0`}
        >
          <SidebarFilters
            categories={categories}
            setCategories={setCategories}
            banks={banks}
            setBanks={setBanks}
            minBonus={minBonus}
            setMinBonus={setMinBonus}
            difficulties={difficulties}
            setDifficulties={setDifficulties}
            times={times}
            setTimes={setTimes}
            statuses={statuses}
            setStatuses={setStatuses}
            onlyNoBIK={onlyNoBIK}
            setOnlyNoBIK={setOnlyNoBIK}
            noCreditImpact={noCreditImpact}
            setNoCreditImpact={setNoCreditImpact}
            clearAll={clearAll}
            toggleInList={toggleInList}
          />
        </aside>

        <div className="flex-1 min-w-0">
          {/* Header nad listą */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-black/[0.06]">
            <div>
              <h2 className="font-semibold text-lg md:text-xl tracking-tight text-zinc-900">
                Promocje bankowe{' '}
                <span className="text-zinc-600 font-normal text-sm ml-1">({filtered.length})</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Niezależne porównanie premii za konta, karty i lokaty
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((v) => !v)}
                className="lg:hidden px-3.5 py-1.5 rounded-xl border border-black/[0.08] bg-white text-xs font-medium text-zinc-800 shadow-xs flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                Filtry
              </button>
              <label htmlFor="sort-select" className="text-xs text-zinc-500 hidden md:block">
                Sortowanie:
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  aria-label="Sortuj oferty"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-black/[0.08] rounded-xl pl-3.5 pr-8 py-1.5 text-xs font-medium text-zinc-800 shadow-xs outline-none hover:border-black/[0.15] transition cursor-pointer"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Wybór redakcji (TOP 3) */}
          {featured.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-3.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                  Wybór redakcji
                </h3>
                <span className="bg-zinc-100 text-zinc-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-black/[0.06]">
                  Top 3 oferty
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {featured.map((promo) => (
                  <FeaturedCard
                    key={promo.id}
                    promo={promo}
                    saved={saved.has(promo.id)}
                    onToggleSaved={() => toggleSaved(promo.id)}
                    onOpen={() => {
                      setSelected(promo)
                      setCostInput(promo.cost)
                    }}
                    progress={progress[promo.id] ?? []}
                    now={now}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Feed */}
          <div className="grid md:grid-cols-2 gap-4">
            {feed.map((promo) => (
              <PromotionCard
                key={promo.id}
                promo={promo}
                saved={saved.has(promo.id)}
                onToggleSaved={() => toggleSaved(promo.id)}
                onOpen={() => {
                  setSelected(promo)
                  setCostInput(promo.cost)
                }}
                progress={progress[promo.id] ?? []}
                now={now}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-zinc-200 p-12 text-center mt-6">
              <p className="font-semibold text-zinc-900">Brak wyników dla wybranych filtrów</p>
              <p className="text-xs text-zinc-500 mt-1">
                Zresetuj filtry, aby wyświetlić wszystkie {PROMOTIONS.length} ofert.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition"
              >
                Zresetuj filtry
              </button>
            </div>
          )}
        </div>
      </main>

      {selected && (
        <DetailModal
          promo={selected}
          now={now}
          costInput={costInput}
          setCostInput={setCostInput}
          progress={progress[selected.id] ?? []}
          setProgressItem={(idx, value) =>
            setProgress((prev) => {
              const arr = [
                ...(prev[selected.id] ?? Array(selected.requirements.length).fill(false)),
              ]
              arr[idx] = value
              return { ...prev, [selected.id]: arr }
            })
          }
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
