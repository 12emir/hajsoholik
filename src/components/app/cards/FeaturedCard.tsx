import { Clock, Heart } from 'lucide-react'

import { type Promotion, promoPath } from '@/data/promotions'

interface Props {
  promo: Promotion
  saved: boolean
  onToggleSaved: () => void
  onOpen: () => void
  progress: boolean[]
}

/** Karta wyróżniona (Hity Tygodnia / TOP 3) — port 1:1 z artifactu. */
export function FeaturedCard({ promo, saved, onToggleSaved, onOpen, progress }: Props) {
  const done = progress.filter(Boolean).length
  const total = promo.requirements.length

  return (
    <article className="group relative bg-white rounded-[16px] border border-zinc-100 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.10)] transition overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ background: promo.color }}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Zobacz szczegóły: ${promo.title}`}
        className="absolute inset-0 z-10 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7] focus-visible:ring-offset-2 rounded-[16px]"
      />

      <div className="relative z-20 flex items-start justify-between mb-3 pointer-events-none">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black"
            style={{ background: promo.color }}
            aria-hidden="true"
          >
            {promo.bankInitial}
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500">{promo.bank}</p>
            <p className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 font-semibold inline-flex">
              {promo.category}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-20 pointer-events-none">
        <h3 className="font-bold text-[15px] leading-tight mb-2 group-hover:text-[#6C5CE7] transition">
          {promo.title}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[28px] font-black tracking-tight">{promo.bonus} zł</span>
          <span className="text-xs text-zinc-500">premii</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {promo.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-1 rounded-full bg-[#F8F9FC] border border-zinc-100"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span
            className={`px-2.5 py-1 rounded-full font-bold ${
              promo.deadlineDays <= 2 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            ⏳ {promo.deadlineLabel}
          </span>
          <span className="flex items-center gap-1 text-zinc-500">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {promo.time}
          </span>
        </div>
        <div className="mt-4">
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden" aria-hidden="true">
            <div className="h-full bg-[#007B46] w-[0%]" />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-[11px] text-zinc-500">
              {done}/{total} kroków
            </p>
            <a
              href={promoPath(promo)}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-bold text-[#007B46] hover:underline pointer-events-auto py-1.5 px-1 -mr-1"
              aria-label={`Zobacz szczegóły i regulamin: ${promo.title}`}
            >
              Szczegóły →
            </a>
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
        className={`absolute top-4 right-4 z-30 w-8 h-8 rounded-full flex items-center justify-center border ${
          saved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-zinc-200'
        }`}
      >
        <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
      </button>
    </article>
  )
}
