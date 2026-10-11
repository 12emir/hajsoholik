import { getPromoLogo } from '@/data/bank-logos'
import type { Promotion } from '@/data/promotions'

interface Props {
  promo: Pick<Promotion, 'id' | 'bank' | 'bankInitial' | 'color'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function BankAvatar({ promo, size = 'md', className = '' }: Props) {
  const logo = getPromoLogo(promo)

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-[10px]',
    md: 'w-11 h-11 rounded-xl text-xs',
    lg: 'w-14 h-14 rounded-2xl text-sm',
  }[size]

  if (logo.url) {
    return (
      <div
        className={`${sizeClasses} bg-white border border-black/[0.08] p-1.5 flex items-center justify-center shrink-0 shadow-xs overflow-hidden ${className}`}
      >
        <img
          src={logo.url}
          alt={promo.bank}
          className="w-full h-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  const brand = logo.brand || { bg: '#18181b', fg: '#ffffff', text: promo.bank }

  return (
    <div
      className={`${sizeClasses} flex items-center justify-center font-bold tracking-tight shrink-0 shadow-xs border border-black/[0.06] select-none ${className}`}
      style={{
        backgroundColor: brand.bg,
        color: brand.fg,
      }}
      aria-hidden="true"
    >
      <span className="font-extrabold px-1 text-center truncate">
        {brand.text || promo.bankInitial}
      </span>
    </div>
  )
}
