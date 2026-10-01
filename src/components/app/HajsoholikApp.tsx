/**
 * HajsoholikApp — główny interaktywny island React.
 * Port 1:1 UI z Hajsoholik-Listing-Promocji-Bankowych.html (listing promocji bankowych).
 * Stan lokalny (filtry, sort, zapisane, postęp wymagań) — bez backendu i API.
 */
import { useEffect, useMemo, useState } from 'react'

import { ArrowRight, ChevronDown, Search, SlidersHorizontal, Trophy } from 'lucide-react'

import { PROMOTIONS, type Promotion, slugify } from '@/data/promotions'
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

export default function HajsoholikApp() {
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
  const [activeNav, setActiveNav] = useState('Oferty')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    } catch {
      // localStorage niedostępny — ignoruj
    }
  }, [progress])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2500)
  }

  const onNavClick = (id: string) => {
    setActiveNav(id)
    if (id === 'Oferty') showToast(`Przeglądasz ${filtered.length} ofert`)
    else showToast(`Sekcja ${id} — wkrótce dostępna`)
  }

  const filtered = useMemo(() => {
    const result = PROMOTIONS.filter((p) => {
      if (
        query &&
        !`${p.title} ${p.bank} ${p.category}`.toLowerCase().includes(query.toLowerCase())
      )
        return false
      if (categories.length && !categories.includes(p.category)) return false
      if (
        banks.length &&
        !banks.includes(p.bank) &&
        !(p.bank === 'BNP Paribas' && banks.includes('BNP'))
      )
        return false
      if (p.bonus < minBonus) return false
      if (difficulties.length && !difficulties.includes(p.difficulty)) return false
      if (times.length && !times.includes(p.time)) return false
      if (statuses.length && !statuses.includes(p.status)) return false
      if (onlyNoBIK && !p.bezBIK) return false
      if (noCreditImpact && !p.bezWplywu) return false
      return true
    })
    return [...result].sort((a, b) => {
      if (sort === 'Najwyższa premia') return b.bonus - a.bonus
      if (sort === 'Najlepsze ROI/h') return b.roi - a.roi
      if (sort === 'Najłatwiejsza') return DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]
      if (sort === 'Kończy się najszybciej') return a.deadlineDays - b.deadlineDays
      if (sort === 'Popularność') return b.popularity - a.popularity
      return 0
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
  ])

  const featured = useMemo(() => {
    const hits = filtered.filter((p) => p.featured).slice(0, 3)
    return hits.length ? hits : filtered.slice(0, 3)
  }, [filtered])

  const feed = useMemo(
    () => filtered.filter((p) => !featured.some((f) => f.id === p.id)),
    [filtered, featured],
  )

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

  const totalDone = (id: number) => (progress[id] || []).filter(Boolean).length

  const savedBonus = PROMOTIONS.filter((p) => saved.has(p.id)).reduce((sum, p) => sum + p.bonus, 0)

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-zinc-900 font-[Inter,system-ui] antialiased">
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
          className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[320px] shrink-0`}
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
          {/* Statystyki */}
          {/* Sortowanie */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-bold text-[18px]">
              Promocje bankowe{' '}
              <span className="text-zinc-500 font-medium">({filtered.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs text-zinc-500 hidden md:block">
                Sortowanie:
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-zinc-200 rounded-full pl-4 pr-8 py-2 text-sm font-medium outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Hity Tygodnia */}
          {featured.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <h3 className="font-black uppercase tracking-widest text-[12px]">Hity Tygodnia</h3>
                <span className="bg-[#FFB800] text-[#18181b] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  TOP 3
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
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-[16px] border border-dashed border-zinc-200 p-12 text-center mt-6">
              <p className="font-bold">Brak wyników dla tych filtrów</p>
              <p className="text-sm text-zinc-500 mt-1">
                Spróbuj wyczyścić filtry lub zmienić wyszukiwanie.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 px-5 py-2 rounded-full bg-zinc-900 text-white text-sm font-bold"
              >
                Wyczyść filtry
              </button>
            </div>
          )}
        </div>
      </main>

      {selected && (
        <DetailModal
          promo={selected}
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
