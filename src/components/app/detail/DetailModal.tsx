import { useEffect, useRef } from 'react'

import { ArrowRight, Check, Clock, TriangleAlert, Users, X } from 'lucide-react'

import { type Promotion, bankPromoUrl, promoPath } from '@/data/promotions'

interface Props {
  promo: Promotion
  costInput: number
  setCostInput: (value: number) => void
  progress: boolean[]
  setProgressItem: (index: number, value: boolean) => void
  onClose: () => void
}

/** Modal szczegółów promocji — port 1:1 z artifactu (kroki, haczyki, kalkulator ROI). */
export function DetailModal({
  promo,
  costInput,
  setCostInput,
  progress,
  setProgressItem,
  onClose,
}: Props) {
  const titleId = `promo-title-${promo.id}`
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const done = progress.filter(Boolean).length
  const total = promo.requirements.length
  const roi = Math.round((promo.bonus - costInput) / (promo.timeMinutes / 60))

  // Focus close button on open; restore focus to trigger element on unmount.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    return () => previouslyFocused?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focus management only on mount/unmount
  }, [])

  // Escape closes; Tab/Shift+Tab trap focus inside the dialog.
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
    <div
      // biome-ignore lint/a11y/useSemanticElements: modal jako komponent z focus trap + Escape (wzorzec sheet)
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: tło dekoracyjne, zamknięcie przez Escape w useEffect */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative w-full md:max-w-[760px] max-h-[92vh] md:max-h-[88vh] bg-white md:rounded-[20px] rounded-t-[20px] shadow-[0_20px_80px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
      >
        <div
          className="h-1 w-full shrink-0"
          style={{ background: promo.color }}
          aria-hidden="true"
        />
        <div className="p-5 md:p-7 overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg"
                style={{ background: promo.color }}
                aria-hidden="true"
              >
                {promo.bankInitial}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded-full">
                    {promo.bank} • {promo.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-bold ${
                      promo.deadlineDays <= 2
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {promo.deadlineLabel}
                  </span>
                </div>
                <h2 id={titleId} className="text-[22px] font-black leading-tight mt-2">
                  {promo.title}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[32px] font-black">{promo.bonus} zł</span>
                  <span className="text-sm text-zinc-500">premii • ROI {promo.roi} zł/h</span>
                </div>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0"
              aria-label="Zamknij szczegóły promocji"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <p className="text-[14px] text-zinc-600 leading-relaxed mt-5">{promo.description}</p>

          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 mt-7">
            <div>
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#007B46]" aria-hidden="true" />
                Kroki do wykonania
              </h3>
              <div className="space-y-2.5">
                {promo.requirements.map((requirement, index) => {
                  const isDone = progress[index] ?? false
                  return (
                    <label
                      key={requirement}
                      className={`flex gap-3 p-3 rounded-[12px] border cursor-pointer transition ${
                        isDone
                          ? 'bg-[#00C26E]/5 border-[#007B46]/80'
                          : 'bg-[#F8F9FC] border-zinc-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => setProgressItem(index, !isDone)}
                        className="mt-0.5 w-4 h-4 accent-[#007B46]"
                      />
                      <span
                        className={`text-[13px] ${isDone ? 'line-through text-zinc-500' : 'font-medium'}`}
                      >
                        {index + 1}. {requirement}
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="text-[11px] text-zinc-500 mt-3" aria-live="polite">
                Postęp: {done}/{total} kroków
              </p>

              <div className="mt-6">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <TriangleAlert className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  Haczyki i regulamin
                </h3>
                <ul className="space-y-2">
                  {promo.haczyki.map((haczyk) => (
                    <li key={haczyk} className="text-[13px] text-zinc-600 flex gap-2">
                      <span className="text-amber-600" aria-hidden="true">
                        •
                      </span>
                      {haczyk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 bg-[#F8F9FC] rounded-[12px] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Weryfikacja oferty
                </p>
                <p className="text-[13px] flex items-center gap-2">
                  <Users className="w-4 h-4" aria-hidden="true" />
                  <span>
                    Zespół Hajsoholik sprawdza warunki promocji i aktualizuje dane na bieżąco. Zanim
                    złożysz wniosek, zweryfikuj regulamin bezpośrednio u banku.
                  </span>
                </p>
                <a
                  href={promoPath(promo)}
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-[#007B46] mt-3 hover:underline"
                >
                  Pełna strona promocji z regulaminem{' '}
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-900 text-white rounded-[16px] p-5">
                <p className="text-xs uppercase tracking-widest font-bold text-zinc-400">
                  Kalkulator zysku
                </p>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Premia</span>
                    <span className="font-bold text-[#00C26E]">+{promo.bonus} zł</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Koszty (np. karta)</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={costInput}
                        onChange={(e) => setCostInput(Number(e.target.value))}
                        className="w-16 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-1 text-white text-sm text-right"
                        aria-label="Koszty w złotych"
                      />
                      <span>zł</span>
                    </div>
                  </div>
                  <div className="h-px bg-zinc-800" />
                  <div className="flex justify-between text-[16px]">
                    <span className="font-bold">Na czysto</span>
                    <span className="font-black text-[20px] text-white">
                      {promo.bonus - costInput} zł
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">ROI: {roi} zł / h pracy</p>
                </div>
                <a
                  href={bankPromoUrl(promo.bank) || promoPath(promo)}
                  target={bankPromoUrl(promo.bank) ? '_blank' : undefined}
                  rel={bankPromoUrl(promo.bank) ? 'noopener' : undefined}
                  className="w-full mt-5 h-11 rounded-full bg-[#007B46] text-white font-black text-sm hover:bg-[#006b3e] transition flex items-center justify-center gap-2"
                >
                  {bankPromoUrl(promo.bank) ? 'Regulamin i warunki u banku' : 'Zobacz promocję'}{' '}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={promoPath(promo)}
                  className="block mt-2 w-full h-9 rounded-full border border-zinc-700 text-white text-[12px] font-bold hover:bg-zinc-800 transition flex items-center justify-center"
                >
                  Pełna strona promocji
                </a>
                <p className="text-[10px] text-zinc-400 text-center mt-2">
                  Link afiliacyjny • wspierasz Hajsoholik
                </p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-[16px] p-4">
                <p className="text-xs font-bold">Szczegóły</p>
                <div className="mt-3 space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Trudność</span>
                    <span className="font-semibold">{promo.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Czas</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {promo.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">BIK</span>
                    <span className={promo.bezBIK ? 'text-[#007B46] font-bold' : 'text-red-700'}>
                      {promo.bezBIK ? 'bez BIK' : 'sprawdza BIK'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Zdolność</span>
                    <span
                      className={promo.bezWplywu ? 'text-[#007B46] font-bold' : 'text-zinc-700'}
                    >
                      {promo.bezWplywu ? 'bez wpływu' : 'wpływa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
