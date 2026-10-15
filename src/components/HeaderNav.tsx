import {
  ArrowUpRight,
  Building2,
  Clock,
  Coins,
  CreditCard,
  Flame,
  Layers,
  Menu,
  PhoneCall,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  currentPath?: string
}

const NAV_LINKS = [
  { label: 'Wszystkie promocje', href: '/', icon: Layers, desc: 'Aktualne premie i okazje' },
  {
    label: 'Konta osobiste',
    href: '/kategoria/konta-osobiste',
    icon: CreditCard,
    desc: 'Do 1010 zł za otwarcie',
  },
  {
    label: 'Konta firmowe',
    href: '/kategoria/konta-firmowe',
    icon: Building2,
    desc: 'Dla JDG i spółek',
  },
  {
    label: 'Karty kredytowe',
    href: '/kategoria/karty-kredytowe',
    icon: CreditCard,
    desc: 'Bonusy z limitem',
  },
  {
    label: 'Kredyty gotówkowe',
    href: '/kredyty-gotowkowe',
    icon: Building2,
    desc: 'Ranking i kalkulator rat',
  },
  {
    label: 'Lokaty bankowe',
    href: '/lokaty-bankowe',
    icon: Layers,
    desc: 'Najwyższe oprocentowanie',
  },
  {
    label: 'Pożyczki pozabankowe',
    href: '/pozyczki-chwilowki',
    icon: Coins,
    desc: 'Chwilówki i pożyczki online',
  },
  {
    label: 'Krypto & Web3',
    href: '/kategoria/krypto',
    icon: Coins,
    desc: 'Giełdy z bonusem startowym',
  },
  {
    label: 'Kończące się w 48h',
    href: '/konczace-sie',
    icon: Clock,
    desc: 'Ostatnia szansa na premię',
  },
]

export function HeaderNav({ currentPath = '/' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Blokowanie scrolla w tle przy otwartym menu mobilnym
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Zamknij na ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const drawerContent =
    isOpen && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[999] lg:hidden">
            {/* Tło przyciemnione */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Panel boczny */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menu nawigacji"
              className="fixed inset-y-0 right-0 w-full max-w-[340px] sm:max-w-[380px] h-full border-0 bg-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 overflow-y-auto"
            >
              {/* Góra draweru */}
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                <a
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5"
                  aria-label="Hajsoholik"
                >
                  <span
                    className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-sm shadow-sm"
                    aria-hidden="true"
                  >
                    H
                  </span>
                  <span className="font-bold text-base tracking-tight text-zinc-900">
                    Hajsoholik
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition"
                  aria-label="Zamknij menu"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Lista linków */}
              <div className="p-4 space-y-1.5 flex-1">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Kategorie i nawigacja
                </div>

                {NAV_LINKS.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPath === item.href
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-white/10 text-white' : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold leading-tight truncate">
                          {item.label}
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 truncate ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </a>
                  )
                })}

                {/* Sekcja wyróżniona: Turbopromki */}
                <div className="pt-4 mt-3 border-t border-zinc-100">
                  <a
                    href="https://turbopromki.pl/"
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setIsOpen(false)}
                    className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-300 text-zinc-900 hover:border-amber-400 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xs">
                        <Flame className="w-5 h-5 fill-current" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-zinc-900">Turbopromki</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/30 text-amber-950 font-bold">
                            Kody & Okazje
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-0.5">Kupony do sklepów online</p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className="w-4 h-4 text-amber-800 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>

              {/* Stopka menu mobilnego */}
              <div className="p-5 border-t border-zinc-100 bg-zinc-50/80 space-y-3">
                <a
                  href="/kontakt"
                  onClick={() => setIsOpen(false)}
                  className="w-full h-10 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-zinc-100 transition shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                  <span>Kontakt z redakcją</span>
                </a>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    Stan na Q4 2026
                  </span>
                  <span>v2.0 Premium</span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="flex items-center">
      {/* Przycisk Menu Mobilnego — widoczny na tabletach i telefonach (lg:hidden) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Zamknij menu nawigacji' : 'Otwórz menu nawigacji'}
        className="lg:hidden w-10 h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 active:scale-95 flex items-center justify-center text-zinc-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
      >
        {isOpen ? (
          <X className="w-5 h-5 transition-transform rotate-0 scale-100" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5 transition-transform" aria-hidden="true" />
        )}
      </button>

      {/* Portal dla Drawera mobilnego */}
      {drawerContent}
    </div>
  )
}
