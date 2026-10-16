import { Banknote, Flame, RotateCcw, Search, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'

import { type SideHustleCategory, getSortedSidehustles } from '@/data/sidehustles'
import { SidehustleCard } from './SidehustleCard'

type FilterMode = 'all' | 'zero_capital' | 'passive' | 'high_roi'

export function SidehustleDirectory() {
  const allHustles = useMemo(() => getSortedSidehustles(), [])

  const [query, setQuery] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const set = new Set<SideHustleCategory>()
    for (const h of allHustles) {
      set.add(h.category)
    }
    return Array.from(set)
  }, [allHustles])

  const filtered = useMemo(() => {
    return allHustles.filter((h) => {
      if (
        query &&
        !`${h.title} ${h.platform} ${h.category} ${h.tags.join(' ')} ${h.description}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        return false
      }

      if (selectedCategory !== 'all' && h.category !== selectedCategory) {
        return false
      }

      if (filterMode === 'zero_capital' && h.capitalRequired > 0) {
        return false
      }

      if (filterMode === 'passive' && h.incomeType !== 'passive') {
        return false
      }

      if (filterMode === 'high_roi' && h.roiPerHour < 200) {
        return false
      }

      return true
    })
  }, [allHustles, query, selectedCategory, filterMode])

  // Podział na grupę z afiliacją (pierwsza) i grupę bez afiliacji (na końcu)
  const affiliateOffers = useMemo(() => filtered.filter((h) => h.hasAffiliateLink), [filtered])
  const directOffers = useMemo(() => filtered.filter((h) => !h.hasAffiliateLink), [filtered])

  const zeroCapitalCount = useMemo(
    () => allHustles.filter((h) => h.capitalRequired === 0).length,
    [allHustles],
  )
  const passiveCount = useMemo(
    () => allHustles.filter((h) => h.incomeType === 'passive').length,
    [allHustles],
  )

  const avgRoi = useMemo(() => {
    if (filtered.length === 0) return 0
    return Math.round(filtered.reduce((sum, h) => sum + h.roiPerHour, 0) / filtered.length)
  }, [filtered])

  const resetAllFilters = () => {
    setQuery('')
    setFilterMode('all')
    setSelectedCategory('all')
  }

  return (
    <div className="space-y-8">
      {/* Sekcja szybkiej statystyki & filtrów */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        {/* Wyszukiwarka i szybkie przyciski */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj metody (np. Notion, ankiety, Vinted, AI, vending)..."
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 hover:text-zinc-700 p-1"
                aria-label="Wyczyść wyszukiwanie"
              >
                ✕
              </button>
            )}
          </div>

          {/* Szybkie przełączniki */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-[0.98] ${
                filterMode === 'all'
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'bg-zinc-100/90 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 border border-transparent'
              }`}
            >
              Wszystkie ({allHustles.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('zero_capital')}
              className={`min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-[0.98] ${
                filterMode === 'zero_capital'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />0 zł na start ({zeroCapitalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('passive')}
              className={`min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-[0.98] ${
                filterMode === 'passive'
                  ? 'bg-indigo-700 text-white shadow-2xs'
                  : 'bg-indigo-50 text-indigo-800 border border-indigo-200/80 hover:bg-indigo-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              Dochód pasywny ({passiveCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('high_roi')}
              className={`min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-[0.98] ${
                filterMode === 'high_roi'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5" aria-hidden="true" />
              ROI &gt; 200 zł/h
            </button>
          </div>
        </div>

        {/* Kategorie — horyzontalne chipsy */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5 max-w-full">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1 shrink-0">
              Kategoria:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Wszystkie
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(query || filterMode !== 'all' || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs text-zinc-500 hover:text-zinc-900 font-semibold flex items-center gap-1 shrink-0 ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        {/* Podsumowanie wyników i średnie ROI */}
        <div className="pt-2 text-[11px] text-zinc-500 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-50">
          <span>
            Wyświetlanie: <strong>{filtered.length}</strong> z {allHustles.length} zweryfikowanych
            metod
          </span>
          {filtered.length > 0 && avgRoi > 0 && (
            <span className="font-medium text-emerald-800">
              Średnie tempo zarobku: <strong>~{avgRoi} zł/h</strong>
            </span>
          )}
        </div>
      </div>

      {/* SEKCJA 1: OFERTY Z LINKIEM AFILIACYJNYM (ZAWSZE PIERWSZE) */}
      {affiliateOffers.length > 0 && (
        <section aria-labelledby="section-affiliate">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200/80">
            <div>
              <h2
                id="section-affiliate"
                className="text-base font-bold text-zinc-900 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                Okazje powitalne z bonusem na start
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Bezpośrednie premie gotówkowe i pakiety startowe od sprawdzonych partnerów
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {affiliateOffers.length} {affiliateOffers.length === 1 ? 'oferta' : 'oferty'}
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {affiliateOffers.map((hustle) => (
              <SidehustleCard key={hustle.id} hustle={hustle} />
            ))}
          </div>
        </section>
      )}

      {/* SEKCJA 2: METODY BEZ AFILIACJI (POKAZYWANE NA KOŃCU) */}
      {directOffers.length > 0 && (
        <section aria-labelledby="section-direct" className="pt-4">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200/80">
            <div>
              <h2
                id="section-direct"
                className="text-base font-bold text-zinc-900 flex items-center gap-2"
              >
                <Banknote className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                Niezależne modele zarabiania (0 zł prowizji)
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Modele biznesowe, produkty cyfrowe, ankiety naukowe i usługi lokalne
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
              {directOffers.length} metod
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {directOffers.map((hustle) => (
              <SidehustleCard key={hustle.id} hustle={hustle} />
            ))}
          </div>
        </section>
      )}

      {/* Brak wyników */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
          <p className="font-semibold text-zinc-900">Brak metod dla wybranych kryteriów</p>
          <p className="text-xs text-zinc-500 mt-1">
            Zmień filtry lub wyczyść wyszukiwanie, aby wyświetlić wszystkie {allHustles.length}{' '}
            sposobów na dorabianie.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition shadow-xs"
          >
            Zresetuj filtry
          </button>
        </div>
      )}
    </div>
  )
}
