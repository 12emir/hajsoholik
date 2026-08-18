import { ArrowRight, Clock, Heart, Zap } from 'lucide-react'

import { type Promotion, promoPath } from '@/data/promotions'

interface Props {
  promo: Promotion
  saved: boolean
  onToggleSaved: () => void
  onOpen: () => void
  progress: boolean[]
}

const difficultyClasses: Record<string, string> = {
  Łatwa: 'bg-[#00C26E]/10 text-[#007B46]',
  Średnia: 'bg-amber-100 text-amber-800',
  Trudna: 'bg-red-100 text-red-700',
}

const statusClasses: Record<string, string> = {
  'Kończy się w 48h': 'bg-red-50 text-red-700',
  Archiwalna: 'bg-zinc-100 text-zinc-500',
  Aktywna: 'bg-[#F8F9FC] text-zinc-600',
}

/** Karta promocji w gridzie — port 1:1 z artifactu. */
export function PromotionCard({ promo, saved, onToggleSaved, onOpen, progress }: Props) {
  const done = progress.filter(Boolean).length
  const total = promo.requirements.length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <article className="group relative bg-white rounded-[16px] border border-zinc-100 p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-zinc-200 transition">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Zobacz szczegóły: ${promo.title}`}
        className="absolute inset-0 z-10 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7] focus-visible:ring-offset-2 rounded-[16px]"
      />

      <div className="relative z-20 pointer-events-none">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-[15px]"
              style={{ background: promo.color }}
              aria-hidden="true"
            >
              {promo.bankInitial}
            </div>
            <div>
              <p className="text-[13px] font-bold">{promo.bank}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${difficultyClasses[promo.difficulty]}`}
                >
                  {promo.difficulty}
                </span>
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <Zap className="w-3 h-3" aria-hidden="true" />
                  {promo.roi} zł/h
                </span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-[15px] leading-snug mt-4 group-hover:text-[#6C5CE7] transition line-clamp-2">
          {promo.title}
        </h3>

        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-500">Premia</p>
            <p className="text-[26px] font-black leading-none mt-1">
              {promo.bonus} <span className="text-[16px] font-bold ml-1">zł</span>
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusClasses[promo.status]}`}
            >
              {promo.deadlineLabel}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {promo.time} • {promo.status}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 mt-3 flex-wrap">
          {promo.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-1 rounded-full bg-[#F8F9FC] border border-zinc-100"
            >
              {tag}
            </span>
          ))}
          {promo.bezBIK && (
            <span className="text-[11px] px-2 py-1 rounded-full bg-[#6C5CE7]/10 text-[#5A4BD6] font-semibold">
              bez BIK
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-500">Postęp wymagań</span>
            <span className="font-bold">
              {done}/{total}
            </span>
          </div>
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden" aria-hidden="true">
            <div className="h-full bg-[#007B46] transition-all" style={{ width: `${percent}%` }} />
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
        className={`absolute top-5 right-5 z-30 w-8 h-8 rounded-full flex items-center justify-center border ${
          saved ? 'bg-red-50 border-red-200 text-red-500' : 'border-zinc-200'
        }`}
      >
        <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
      </button>

      <div className="relative z-20 mt-4 flex items-center gap-2 pointer-events-none">
        <a
          href={promoPath(promo)}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 h-10 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center gap-1.5 pointer-events-auto"
          aria-label={`Zobacz szczegóły i regulamin: ${promo.title}`}
        >
          Sprawdź <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" aria-hidden="true" />
          Oferta sprawdzona
        </span>
      </div>
    </article>
  )
}
