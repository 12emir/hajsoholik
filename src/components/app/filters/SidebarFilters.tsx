import { Shield, SlidersHorizontal, Sparkles, Timer } from 'lucide-react'

import { BANKS, CATEGORIES, DIFFICULTIES, STATUSES, TIMES } from '@/data/promotions'

interface Props {
  categories: string[]
  setCategories: (value: string[]) => void
  banks: string[]
  setBanks: (value: string[]) => void
  minBonus: number
  setMinBonus: (value: number) => void
  difficulties: string[]
  setDifficulties: (value: string[]) => void
  times: string[]
  setTimes: (value: string[]) => void
  statuses: string[]
  setStatuses: (value: string[]) => void
  onlyNoBIK: boolean
  setOnlyNoBIK: (value: boolean) => void
  noCreditImpact: boolean
  setNoCreditImpact: (value: boolean) => void
  clearAll: () => void
  toggleInList: (list: string[], value: string) => string[]
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-2.5">
      {children}
    </p>
  )
}

/** Sidebar filtrów — standard Apple-tier. */
export function SidebarFilters({
  categories,
  setCategories,
  banks,
  setBanks,
  minBonus,
  setMinBonus,
  difficulties,
  setDifficulties,
  times,
  setTimes,
  statuses,
  setStatuses,
  onlyNoBIK,
  setOnlyNoBIK,
  noCreditImpact,
  setNoCreditImpact,
  clearAll,
  toggleInList,
}: Props) {
  return (
    <div className="lg:sticky lg:top-[88px] space-y-3.5">
      <div className="bg-white rounded-2xl border border-black/[0.08] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-zinc-900">
            <SlidersHorizontal className="w-4 h-4 text-zinc-500" aria-hidden="true" />
            Filtry
          </h2>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition"
          >
            Resetuj
          </button>
        </div>

        {/* Kategorie */}
        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Kategorie promocji</legend>
          <SectionLabel>Kategorie</SectionLabel>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2.5 text-[13px] cursor-pointer group select-none"
              >
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => setCategories(toggleInList(categories, category))}
                  className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 transition"
                />
                <span className="text-zinc-600 group-hover:text-zinc-900 transition">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Bank */}
        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Bank</legend>
          <SectionLabel>Bank</SectionLabel>
          <div className="grid grid-cols-2 gap-1.5">
            {BANKS.map((bank) => {
              const isChecked = banks.includes(bank)
              return (
                <label
                  key={bank}
                  className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-xl border cursor-pointer transition select-none ${
                    isChecked
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200/60 hover:bg-zinc-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setBanks(toggleInList(banks, bank))}
                    className="sr-only"
                  />
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-white' : 'bg-zinc-400'}`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{bank}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        {/* Wysokość premii */}
        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Wysokość premii</legend>
          <SectionLabel>Wysokość premii</SectionLabel>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-500 font-medium">Od:</span>
            <span className="font-semibold text-zinc-900 tabular-nums">{minBonus}+ zł</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={minBonus}
            onChange={(e) => setMinBonus(Number(e.target.value))}
            className="w-full accent-zinc-900 cursor-pointer"
            aria-label="Minimalna wysokość premii w złotych"
          />
          <div className="flex justify-between text-[11px] text-zinc-400 mt-1 tabular-nums">
            <span>0 zł</span>
            <span>1000 zł</span>
          </div>
        </fieldset>

        {/* Trudność */}
        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Trudność</legend>
          <SectionLabel>Trudność</SectionLabel>
          <div className="flex gap-1.5">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => setDifficulties(toggleInList(difficulties, difficulty))}
                aria-pressed={difficulties.includes(difficulty)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition ${
                  difficulties.includes(difficulty)
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200/60 hover:bg-zinc-100'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Czas realizacji */}
        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Czas realizacji</legend>
          <SectionLabel>Czas</SectionLabel>
          <div className="flex gap-1.5">
            {TIMES.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setTimes(toggleInList(times, time))}
                aria-pressed={times.includes(time)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1 transition ${
                  times.includes(time)
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200/60 hover:bg-zinc-100'
                }`}
              >
                <Timer className="w-3 h-3" aria-hidden="true" />
                {time}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Status */}
        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Status promocji</legend>
          <SectionLabel>Status</SectionLabel>
          <div className="space-y-2">
            {STATUSES.map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 text-[13px] cursor-pointer group select-none"
              >
                <input
                  type="checkbox"
                  checked={statuses.includes(status)}
                  onChange={() => setStatuses(toggleInList(statuses, status))}
                  className="w-4 h-4 rounded border-zinc-300 accent-zinc-900"
                />
                <span
                  className={
                    status === 'Kończy się w 48h'
                      ? 'text-amber-800 font-medium'
                      : 'text-zinc-600 group-hover:text-zinc-900'
                  }
                >
                  {status}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Dodatkowe kryteria */}
        <div className="pt-3.5 border-t border-zinc-100 space-y-2.5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={onlyNoBIK}
              onChange={(e) => setOnlyNoBIK(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-zinc-600 group-hover:text-zinc-900 flex items-center gap-1.5">
              Tylko bez BIK <Shield className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
            </span>
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={noCreditImpact}
              onChange={(e) => setNoCreditImpact(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-zinc-600 group-hover:text-zinc-900">Bez wpływu na zdolność</span>
          </label>
        </div>
      </div>

      {/* Apple-style Callout */}
      <div className="bg-zinc-900 rounded-2xl p-4 text-white shadow-xs">
        <p className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          Rada eksperta
        </p>
        <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
          Wybierz filtry <span className="text-white font-medium">„Łatwa”</span> i{' '}
          <span className="text-white font-medium">„15min”</span>. 3 takie oferty to ~600 zł zysku
          bez weryfikacji BIK.
        </p>
      </div>
    </div>
  )
}

export type { Props as SidebarFiltersProps }
