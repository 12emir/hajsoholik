import { ArrowUpRight, ChevronDown, ChevronUp, ShieldAlert, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { SideHustle } from '@/data/sidehustles'

interface Props {
  hustle: SideHustle
}

const difficultyStyles: Record<string, string> = {
  Łatwa: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Średnia: 'bg-amber-50 text-amber-700 border-amber-200/60',
  Trudna: 'bg-rose-50 text-rose-700 border-rose-200/60',
}

const STORAGE_PREFIX = 'hajsoholik_hustle_steps_'

export function SidehustleCard({ hustle }: Props) {
  const [stepsOpen, setStepsOpen] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({})

  // Odczyt z localStorage po zamontowaniu (SSR-safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${hustle.id}`)
      if (raw) {
        setCompletedSteps(JSON.parse(raw))
      }
    } catch {
      // Ignoruj błędy localStorage
    }
  }, [hustle.id])

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => {
      const next = { ...prev, [idx]: !prev[idx] }
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${hustle.id}`, JSON.stringify(next))
      } catch {
        // Ignoruj błędy zapisu
      }
      return next
    })
  }

  const completedCount = Object.values(completedSteps).filter(Boolean).length
  const totalSteps = hustle.requirements.length
  const percentDone = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0

  return (
    <article className="group relative bg-white rounded-2xl border border-zinc-200/90 hover:border-zinc-300 p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200">
      {/* Główny wiersz listy: na desktopie układ horyzontalny (Info - Metryki - Akcje) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Kolumna lewa: Avatar + Platforma + Kategoria + Tytuł + Opis + Tagi */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base shadow-xs select-none shrink-0 mt-0.5"
            style={{
              backgroundColor: hustle.brandColor,
              color: ['#FF90E8', '#00F0FF', '#F7A600'].includes(hustle.brandColor)
                ? '#09090b'
                : '#ffffff',
            }}
            aria-hidden="true"
          >
            {hustle.platformInitial}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm font-bold text-zinc-900 leading-tight">
                {hustle.platform}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-xs text-zinc-500 font-medium">{hustle.category}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                  difficultyStyles[hustle.difficulty] || 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {hustle.difficulty}
              </span>
              {hustle.hasAffiliateLink ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" aria-hidden="true" />
                  Bonus na start
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                  0 zł prowizji
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-zinc-900 group-hover:text-zinc-700 transition leading-snug">
              {hustle.title}
            </h3>

            <p className="text-xs text-zinc-600 mt-1 leading-relaxed line-clamp-2 lg:line-clamp-1 max-w-2xl">
              {hustle.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold">
                {hustle.incomeTypeLabel}
              </span>
              {hustle.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200/60 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Kolumna środkowa: Metryki finansowe (Zysk, Kapitał, Tempo ROI) */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0 bg-zinc-50/80 rounded-xl px-4 py-3 border border-zinc-100 self-stretch lg:self-center justify-between lg:justify-start">
          <div>
            <span className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Szacowany zysk
            </span>
            <span className="text-base md:text-lg font-black text-zinc-900 tabular-nums whitespace-nowrap">
              {hustle.earningsDisplay}
            </span>
          </div>

          <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

          <div>
            <span className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Kapitał
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block whitespace-nowrap ${
                hustle.capitalRequired === 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-zinc-200/80 text-zinc-800'
              }`}
            >
              {hustle.capitalRequired === 0 ? '0 zł' : `${hustle.capitalRequired} zł`}
            </span>
          </div>

          {hustle.roiPerHour > 0 && (
            <>
              <div className="h-8 w-px bg-zinc-200 hidden md:block" />
              <div className="hidden md:block">
                <span className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Tempo ROI
                </span>
                <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                  ~{hustle.roiPerHour} zł/h
                </span>
              </div>
            </>
          )}
        </div>

        {/* Kolumna prawa: Przyciski CTA & Przełącznik kroków */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-2 shrink-0 lg:w-48">
          <div className="flex items-center gap-2">
            <a
              href={hustle.targetUrl}
              target="_blank"
              rel={hustle.hasAffiliateLink ? 'sponsored noopener' : 'noopener'}
              className="flex-1 min-h-[38px] px-3.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-zinc-800 active:scale-[0.98] transition shadow-xs whitespace-nowrap"
            >
              {hustle.hasAffiliateLink ? 'Odbierz bonus' : 'Do platformy'}
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href={`/sposoby/${hustle.seoSlug}`}
              className="min-h-[38px] px-3 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center justify-center hover:bg-zinc-200 active:scale-[0.98] transition whitespace-nowrap"
              title={`Poradnik: ${hustle.title}`}
            >
              Poradnik
            </a>
          </div>

          <button
            type="button"
            onClick={() => setStepsOpen(!stepsOpen)}
            className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 flex items-center justify-center gap-1 py-1 focus:outline-none"
          >
            <span>Kroki startu ({completedCount}/{totalSteps})</span>
            {stepsOpen ? (
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Pasek postępu kroków */}
      <div className="h-1 bg-zinc-100 rounded-full overflow-hidden mt-3" aria-hidden="true">
        <div
          className="h-full bg-zinc-900 transition-all duration-300"
          style={{ width: `${percentDone}%` }}
        />
      </div>

      {/* Rozwijana szuflada z instrukcją krok po kroku i haczykami */}
      {stepsOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-100 space-y-3 bg-zinc-50/70 p-4 rounded-xl border border-zinc-200/60 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Instrukcja krok po kroku ({completedCount}/{totalSteps} ukończono):
            </p>
            <span className="text-xs font-bold text-zinc-700">{percentDone}%</span>
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            {hustle.requirements.map((req, idx) => {
              const isDone = completedSteps[idx] ?? false
              return (
                <label
                  key={req}
                  className="flex items-start gap-2.5 text-xs cursor-pointer group select-none text-zinc-700 hover:text-zinc-900 transition bg-white p-2.5 rounded-lg border border-zinc-200/60"
                >
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleStep(idx)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 focus:ring-offset-0 cursor-pointer"
                  />
                  <span
                    className={isDone ? 'line-through text-zinc-400 font-normal' : 'font-medium'}
                  >
                    {req}
                  </span>
                </label>
              )
            })}
          </div>

          {hustle.haczyki.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-200/60">
              <p className="text-[11px] font-semibold text-amber-800 flex items-center gap-1 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                Haczyki, formalności i ryzyka:
              </p>
              <ul className="list-disc list-inside text-xs text-zinc-600 space-y-1">
                {hustle.haczyki.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
