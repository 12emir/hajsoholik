import { useEffect, useRef } from 'react'

import { ArrowUpRight, Check, Clock, TriangleAlert, Users, X } from 'lucide-react'

import { BankAvatar } from '@/components/app/BankAvatar'
import {
  type Promotion,
  affiliateAttrs,
  ctaLabel,
  deadlineChip,
  promoPath,
} from '@/data/promotions'

interface Props {
  promo: Promotion
  costInput: number
  setCostInput: (value: number) => void
  progress: boolean[]
  setProgressItem: (index: number, value: boolean) => void
  onClose: () => void
  /** „Teraz" dla liczenia terminu — SSR podaje datę builda, klient dolicza po zamontowaniu. */
  now: Date
}

/** Modal szczegółów promocji — standard Apple-tier. */
export function DetailModal({
  promo,
  costInput,
  setCostInput,
  progress,
  setProgressItem,
  onClose,
  now,
}: Props) {
  const titleId = `promo-title-${promo.id}`
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const done = progress.filter(Boolean).length
  const total = promo.requirements.length
  const roi = Math.round((promo.bonus - costInput) / (promo.timeMinutes / 60))
  const chip = deadlineChip(promo.deadlineDate, now)
  const chipClass =
    chip.tone === 'expired'
      ? 'bg-zinc-100 text-zinc-600'
      : chip.tone === 'urgent'
        ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
        : 'bg-zinc-100 text-zinc-600'

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    return () => previouslyFocused?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement
        if (e.shiftKey && (active === first || active === dialogRef.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-transparent p-0 m-0 w-full h-full max-w-none max-h-none border-0"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity cursor-default border-0 p-0 w-full h-full"
        onClick={onClose}
        aria-label="Zamknij tło"
      />
      <div
        ref={dialogRef}
        className="relative w-full md:max-w-[760px] max-h-[92vh] md:max-h-[88vh] bg-white md:rounded-2xl rounded-t-2xl shadow-[0_20px_80px_rgba(0,0,0,0.18)] border border-zinc-200 overflow-hidden flex flex-col"
      >
        <div className="p-5 md:p-7 overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3.5 items-start">
              <BankAvatar promo={promo} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-black/[0.04]">
                    {promo.bank} • {promo.category}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${chipClass}`}>
                    {chip.label}
                  </span>
                </div>
                <h2
                  id={titleId}
                  className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 leading-snug mt-2"
                >
                  {promo.title}
                </h2>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-3xl font-extrabold tracking-tight text-zinc-900 tabular-nums">
                    {promo.bonus} zł
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    {promo.bonusKind === 'interest'
                      ? 'odsetek'
                      : promo.bonusKind === 'monthly'
                        ? 'cashback/mc'
                        : 'premii'}{' '}
                    • ROI ~{promo.roi} zł/h
                  </span>
                </div>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 flex items-center justify-center shrink-0 transition"
              aria-label="Zamknij szczegóły promocji"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <p className="text-sm text-zinc-600 leading-relaxed mt-5">{promo.description}</p>

          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                Kroki do wykonania
              </h3>
              <div className="space-y-2">
                {promo.requirements.map((requirement, index) => {
                  const isDone = progress[index] ?? false
                  return (
                    <label
                      key={requirement}
                      className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-300/80 text-zinc-500'
                          : 'bg-zinc-50/60 border-zinc-200/60 hover:bg-zinc-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => setProgressItem(index, !isDone)}
                        className="mt-0.5 w-4 h-4 rounded border-zinc-300 accent-zinc-900"
                      />
                      <span
                        className={`text-xs leading-relaxed ${isDone ? 'line-through text-zinc-400' : 'font-medium text-zinc-800'}`}
                      >
                        {index + 1}. {requirement}
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="text-[11px] text-zinc-400 mt-2" aria-live="polite">
                Postęp wymagań: {done}/{total} kroków
              </p>

              <div className="mt-5">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-900 mb-2.5 flex items-center gap-1.5">
                  <TriangleAlert className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  Haczyki i warunki regulaminu
                </h3>
                <ul className="space-y-1.5">
                  {promo.haczyki.map((haczyk) => (
                    <li key={haczyk} className="text-xs text-zinc-600 flex gap-2 leading-relaxed">
                      <span className="text-amber-600 font-bold" aria-hidden="true">
                        •
                      </span>
                      {haczyk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 bg-zinc-50 rounded-xl p-4 border border-black/[0.06]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Weryfikacja redakcji
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2">
                  <Users className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Redakcja Hajsoholik bada regulaminy bankowe. Przed złożeniem wniosku zweryfikuj
                    aktualne warunki bezpośrednio na stronie banku.
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Kalkulator zysku */}
              <div className="bg-zinc-900 text-white rounded-2xl p-5 shadow-xs">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                  Kalkulator zysku netto
                </p>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Premia brutto</span>
                    <span className="font-semibold text-emerald-400">+{promo.bonus} zł</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Koszty (np. karta)</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={costInput}
                        onChange={(e) => setCostInput(Number(e.target.value))}
                        className="w-14 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-0.5 text-white text-xs text-right outline-none"
                        aria-label="Koszty w złotych"
                      />
                      <span>zł</span>
                    </div>
                  </div>
                  <div className="h-px bg-zinc-800 my-2" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-zinc-300">Zysk na czysto</span>
                    <span className="font-bold text-xl text-white tabular-nums">
                      {promo.bonus - costInput} zł
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">ROI: ~{roi} zł / godzinę pracy</p>
                </div>

                <a
                  href={promo.url || promoPath(promo)}
                  {...(promo.url ? affiliateAttrs : {})}
                  className="w-full mt-4 h-10 rounded-xl bg-white text-zinc-900 font-semibold text-xs hover:bg-zinc-100 active:scale-[0.98] transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {ctaLabel(promo)} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <a
                  href={promoPath(promo)}
                  className="block mt-2 w-full h-8 rounded-xl border border-zinc-800 text-zinc-300 text-[11px] font-medium hover:bg-zinc-800 hover:text-white transition flex items-center justify-center"
                >
                  Dedykowana strona z regulaminem
                </a>
              </div>

              {/* Parametry */}
              <div className="bg-white border border-black/[0.08] rounded-2xl p-4 shadow-xs">
                <p className="text-xs font-semibold text-zinc-900 mb-2.5">Parametry oferty</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Trudność</span>
                    <span className="font-medium text-zinc-900">{promo.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Czas na wykonanie</span>
                    <span className="font-medium text-zinc-900 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                      {promo.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Weryfikacja BIK</span>
                    <span
                      className={`font-medium ${promo.bezBIK ? 'text-emerald-700' : 'text-zinc-700'}`}
                    >
                      {promo.bezBIK ? 'brak weryfikacji' : 'wymagana'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Wpływ na zdolność</span>
                    <span className="font-medium text-zinc-900">
                      {promo.bezWplywu ? 'brak wpływu' : 'wpływa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
