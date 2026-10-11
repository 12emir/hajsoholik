import { ArrowUpRight, Clock, Heart } from 'lucide-react'

import { BankAvatar } from '@/components/app/BankAvatar'
import { type Promotion, ctaLabel, promoPath } from '@/data/promotions'

interface Props {
  promo: Promotion
  saved: boolean
  onToggleSaved: () => void
  onOpen: () => void
  progress: boolean[]
}

/** Karta wyróżniona (Hity Tygodnia / TOP 3) — standard Apple-tier z wyraźnym obramowaniem. */
export function FeaturedCard({ promo, saved, onToggleSaved, onOpen, progress }: Props) {
  const done = progress.filter(Boolean).length
  const total = promo.requirements.length

  const isEndingSoon = promo.deadlineDays > 0 && promo.deadlineDays <= 3

  return (
    <article className="group relative bg-white rounded-2xl border border-zinc-300 hover:border-zinc-400 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Zobacz szczegóły: ${promo.title}`}
        className="absolute inset-0 z-10 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 rounded-2xl"
      />

      {/* Top Header: Bank + Category + Save button */}
      <div>
        <div className="relative z-20 flex items-center justify-between mb-4 pointer-events-none">
          <div className="flex items-center gap-3">
            <BankAvatar promo={promo} size="md" />
            <div>
              <p className="text-sm font-bold text-zinc-900 leading-tight">{promo.bank}</p>
              <p className="text-xs font-medium text-zinc-500 mt-0.5">{promo.category}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleSaved()
            }}
            aria-label={saved ? `Usuń z zapisanych: ${promo.title}` : `Zapisz: ${promo.title}`}
            aria-pressed={saved}
            className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center border transition ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-500'
                : 'bg-white border-zinc-200/80 text-zinc-400 hover:text-zinc-800 hover:border-zinc-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
        </div>

        {/* Title */}
        <h3 className="relative z-20 pointer-events-none font-semibold text-[15px] leading-snug text-zinc-900 group-hover:text-zinc-700 transition line-clamp-2 mb-3">
          {promo.title}
        </h3>

        {/* Bonus Value + ROI */}
        <div className="relative z-20 pointer-events-none flex items-baseline justify-between mb-3.5 pt-1 border-t border-zinc-100">
          <div>
            <span className="text-[26px] font-bold tracking-tight text-zinc-900 tabular-nums">
              {promo.bonus} zł
            </span>
            <span className="text-xs font-medium text-zinc-500 ml-1.5">
              {promo.bonusKind === 'interest'
                ? 'odsetek'
                : promo.bonusKind === 'monthly'
                  ? 'cashback/mc'
                  : 'premii'}
            </span>
          </div>
          {promo.roi > 0 && (
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                ~{promo.roi} zł/h
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="relative z-20 pointer-events-none flex flex-wrap gap-1.5 mb-4">
          {promo.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200/60 font-medium"
            >
              {tag}
            </span>
          ))}
          {promo.bezBIK && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
              bez BIK
            </span>
          )}
        </div>
      </div>

      {/* Footer: Timeline + Progress + CTA */}
      <div className="relative z-20 pt-3 border-t border-zinc-100">
        <div className="flex items-center justify-between text-xs mb-3 pointer-events-none">
          <span
            className={`px-2 py-0.5 rounded-md font-medium text-[11px] flex items-center gap-1 ${
              isEndingSoon
                ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            <Clock className="w-3 h-3" aria-hidden="true" />
            {promo.deadlineLabel}
          </span>
          <span className="text-zinc-500 text-[11px] font-medium flex items-center gap-1">
            Czas: {promo.time}
          </span>
        </div>

        {/* Progress indicator */}
        <div className="mb-3.5">
          <div className="h-1 bg-zinc-100 rounded-full overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-zinc-900 transition-all"
              style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[11px] text-zinc-500">
            <span>
              Kroki: {done}/{total}
            </span>
            <span className="text-zinc-700 font-medium group-hover:underline">Szczegóły →</span>
          </div>
        </div>

        {/* Apple Island CTA */}
        <a
          href={promo.url || promoPath(promo)}
          target={promo.url ? '_blank' : undefined}
          rel={promo.url ? 'noopener' : undefined}
          onClick={(e) => e.stopPropagation()}
          className="relative z-20 w-full h-10 rounded-xl bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 pointer-events-auto hover:bg-zinc-800 active:scale-[0.98] transition shadow-xs"
          aria-label={`${ctaLabel(promo)}: ${promo.title}`}
        >
          {ctaLabel(promo)} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
