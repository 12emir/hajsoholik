import { Shield, SlidersHorizontal, Sparkles, Timer } from 'lucide-react'

import { BANKS, CATEGORIES, DIFFICULTIES, PROMOTIONS, STATUSES, TIMES } from '@/data/promotions'

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
    <p className="text-[12px] font-bold tracking-widest text-zinc-500 uppercase mb-3">{children}</p>
  )
}

/** Sidebar filtrów — port 1:1 z artifactu (kategorie, banki, premia, trudność, czas, status, BIK). */
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
    <div className="lg:sticky lg:top-[88px] space-y-4">
      <div className="bg-white rounded-[16px] border border-zinc-100 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filtry
          </h2>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-[#6C5CE7] hover:underline"
          >
            Wyczyść
          </button>
        </div>

        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Kategorie promocji</legend>
          <SectionLabel>Kategorie</SectionLabel>
          <div className="space-y-2.5">
            {CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2.5 text-[14px] cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => setCategories(toggleInList(categories, category))}
                  className="w-4 h-4 rounded border-zinc-300 accent-[#6C5CE7]"
                />
                <span className="group-hover:text-zinc-900 text-zinc-700">{category}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Bank</legend>
          <SectionLabel>Bank</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {BANKS.map((bank) => {
              const isChecked = banks.includes(bank)
              return (
                <label
                  key={bank}
                  className={`flex items-center gap-2 text-[13px] px-2.5 py-2 rounded-full border cursor-pointer transition ${
                    isChecked
                      ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setBanks(toggleInList(banks, bank))}
                    className="sr-only"
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: PROMOTIONS.find((p) => p.bank.includes(bank))?.color || '#6C5CE7',
                    }}
                    aria-hidden="true"
                  />
                  {bank}
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Wysokość premii</legend>
          <SectionLabel>Wysokość premii</SectionLabel>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-500">Min: {minBonus} zł</span>
            <span className="font-bold text-[#007B46]">{minBonus}+ zł</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={minBonus}
            onChange={(e) => setMinBonus(Number(e.target.value))}
            className="w-full accent-[#00C26E]"
            aria-label="Minimalna wysokość premii w złotych"
          />
          <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
            <span>0 zł</span>
            <span>1000 zł</span>
          </div>
        </fieldset>

        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Trudność</legend>
          <SectionLabel>Trudność</SectionLabel>
          <div className="flex gap-2">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => setDifficulties(toggleInList(difficulties, difficulty))}
                aria-pressed={difficulties.includes(difficulty)}
                className={`flex-1 py-2 rounded-full text-xs font-semibold border ${
                  difficulties.includes(difficulty)
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white border-zinc-200'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Czas realizacji</legend>
          <SectionLabel>Czas realizacji</SectionLabel>
          <div className="flex gap-2">
            {TIMES.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setTimes(toggleInList(times, time))}
                aria-pressed={times.includes(time)}
                className={`flex-1 py-2 rounded-full text-xs font-semibold border flex items-center justify-center gap-1 ${
                  times.includes(time)
                    ? 'bg-[#007B46] text-white border-[#007B46]'
                    : 'bg-white border-zinc-200'
                }`}
              >
                <Timer className="w-3 h-3" aria-hidden="true" />
                {time}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="sr-only">Status promocji</legend>
          <SectionLabel>Status</SectionLabel>
          <div className="space-y-2">
            {STATUSES.map((status) => (
              <label key={status} className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={statuses.includes(status)}
                  onChange={() => setStatuses(toggleInList(statuses, status))}
                  className="w-4 h-4 rounded border-zinc-300 accent-[#6C5CE7]"
                />
                <span className={status === 'Kończy się w 48h' ? 'text-red-600 font-semibold' : ''}>
                  {status}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="pt-4 border-t border-zinc-100 space-y-3">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyNoBIK}
              onChange={(e) => setOnlyNoBIK(e.target.checked)}
              className="w-4 h-4 rounded accent-[#6C5CE7]"
            />
            Tylko bez BIK <Shield className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input
              type="checkbox"
              checked={noCreditImpact}
              onChange={(e) => setNoCreditImpact(e.target.checked)}
              className="w-4 h-4 rounded accent-[#6C5CE7]"
            />
            Bez wpływu na zdolność
          </label>
        </div>
      </div>

      <div className="bg-[#6C5CE7] rounded-[16px] p-5 text-white">
        <p className="text-sm font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Pro Tip
        </p>
        <p className="text-[13px] mt-2 leading-relaxed">
          Zacznij od ofert „Łatwa” + „15min”. 3 takie = ~600 zł w godzinę bez BIK.
        </p>
      </div>
    </div>
  )
}

export type { Props as SidebarFiltersProps }
