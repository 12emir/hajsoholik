import { ArrowUpRight, Clock, Heart } from 'lucide-react'

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
  saved: boolean
  onToggleSaved: () => void
  onOpen: () => void
  progress: boolean[]
  /** „Teraz" dla liczenia terminu — SSR podaje datę builda, klient dolicza po zamontowaniu. */
  now: Date
}

const difficultyStyles: Record<string, string> = {
  Łatwa: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  Średnia: 'bg-amber-50 text-amber-700 border-amber-200/50',
  Trudna: 'bg-zinc-100 text-zinc-700 border-zinc-200/50',
}

/** Karta promocji w siatce — standard Apple-tier z wyraźnym obramowaniem. */
export function PromotionCard({ promo, saved, onToggleSaved, onOpen, progress, now }: Props) {
  const done = progress.filter(Boolean).length
  const total = promo.requirements.length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  const chip = deadlineChip(promo.deadlineDate, now)
  const chipClass =
    chip.tone === 'expired'
      ? 'bg-zinc-100 text-zinc-600'
      : chip.tone === 'urgent'
        ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
        : 'bg-zinc-100 text-zinc-600'

  return (
    <article className="group relative bg-white rounded-2xl border border-zinc-300 hover:border-zinc-400 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Zobacz szczegóły: ${promo.title}`}
        className="absolute inset-0 z-10 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 rounded-2xl"
      />

      {/* Header: Bank & Meta */}
      <div>
        <div className="relative z-20 flex items-center justify-between mb-3.5 pointer-events-none">
          <div className="flex items-center gap-3">
            <BankAvatar promo={promo} size="md" />
            <div>
              <p className="text-sm font-bold text-zinc-900 leading-tight">{promo.bank}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${difficultyStyles[promo.difficulty] || 'bg-zinc-100 text-zinc-600'}`}
                >
                  {promo.difficulty}
                </span>
                {promo.roi > 0 && (
                  <span className="text-[11px] text-zinc-500 font-medium">~{promo.roi} zł/h</span>
                )}
              </div>
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
        <h3 className="relative z-20 pointer-events-none font-semibold text-[15px] leading-snug text-zinc-900 group-hover:text-zinc-700 transition line-clamp-2 mt-3 mb-3">
          {promo.title}
        </h3>

        {/* Bonus & Status */}
        <div className="relative z-20 pointer-events-none flex items-baseline justify-between mb-3 pt-2 border-t border-zinc-100">
          <div>
            <span className="text-[24px] font-bold tracking-tight text-zinc-900 tabular-nums">
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
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 ${chipClass}`}
          >
            <Clock className="w-3 h-3" aria-hidden="true" />
            {chip.label}
          </span>
        </div>

        {/* Tags */}
        <div className="relative z-20 pointer-events-none flex flex-wrap gap-1.5 mb-3.5">
          {promo.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200/60 font-medium"
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

      {/* Progress & CTAs */}
      <div className="relative z-20 pt-3 border-t border-zinc-100">
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1 pointer-events-none">
            <span>
              Kroki: {done}/{total}
            </span>
            <span>{promo.time}</span>
          </div>
          <div className="h-1 bg-zinc-100 rounded-full overflow-hidden" aria-hidden="true">
            <div className="h-full bg-zinc-900 transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={promo.url || promoPath(promo)}
            {...(promo.url ? affiliateAttrs : {})}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 h-9 rounded-xl bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 pointer-events-auto hover:bg-zinc-800 active:scale-[0.98] transition shadow-xs"
            aria-label={`${ctaLabel(promo)}: ${promo.title}`}
          >
            {ctaLabel(promo)} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <a
            href={promoPath(promo)}
            onClick={(e) => e.stopPropagation()}
            className="h-9 px-3 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center justify-center pointer-events-auto hover:bg-zinc-200 transition"
            aria-label={`Szczegóły: ${promo.title}`}
          >
            Szczegóły
          </a>
        </div>
      </div>
    </article>
  )
}
