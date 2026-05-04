import { Link } from 'react-router-dom'
import { ADMIN_BASE_PATH, SHOW_ADMIN_IN_NAV } from '../../lib/adminRoutes'
import { StatusIndicator } from './StatusIndicator'

type Props = { isOpen: boolean }

const links = [
  { id: 'plats', label: 'Plats du jour' },
  { id: 'histoire', label: 'Histoire' },
  { id: 'avis', label: 'Avis' },
  { id: 'contact', label: 'Contact' },
]

function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function SiteNav({ isOpen }: Props) {
  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-50 px-5 py-5 md:px-10 md:py-7">
      <div className="pointer-events-auto flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="font-display text-xl tracking-wide text-teranga-paper md:text-2xl"
          >
            Teranga Saveurs
          </Link>
          <span className="hidden text-white/25 md:inline">/</span>
          <StatusIndicator open={isOpen} />
        </div>
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => scrollToSection(l.id)}
              className="relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-teranga-gold after:transition-all hover:text-white hover:after:w-full"
            >
              {l.label}
            </button>
          ))}
          {SHOW_ADMIN_IN_NAV ? (
            <Link
              to={ADMIN_BASE_PATH}
              className="rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-white/60 transition hover:border-teranga-gold/60 hover:text-white"
            >
              Admin
            </Link>
          ) : null}
        </nav>
      </div>
      <nav className="pointer-events-auto mt-2 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/5 pt-3 text-[0.68rem] uppercase tracking-[0.16em] text-white/55 md:hidden">
        {links.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => scrollToSection(l.id)}
            className="transition hover:text-white"
          >
            {l.label}
          </button>
        ))}
        {SHOW_ADMIN_IN_NAV ? (
          <Link to={ADMIN_BASE_PATH} className="transition hover:text-white">
            Admin
          </Link>
        ) : null}
      </nav>
    </header>
  )
}
