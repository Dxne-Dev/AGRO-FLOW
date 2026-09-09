import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/lots', label: 'Lots' },
  { to: '/matching', label: 'Matching' },
  { to: '/grouping', label: 'Regroupement' },
]

export function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-800">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-iris text-sm font-bold text-white">
              A
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-800">
              AgroFlow
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Navigation principale"
          >
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-zinc-100 text-iris'
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/lots/nouveau"
              className="af-btn af-btn-primary hidden !px-4 !py-2 !text-sm sm:inline-flex"
            >
              Nouveau lot
            </Link>
            <button
              type="button"
              className="af-btn af-btn-ghost md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>

        {open ? (
          <nav
            id="mobile-nav"
            className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden"
            aria-label="Navigation mobile"
          >
            <div className="flex flex-col gap-1">
              {links.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      'rounded-lg px-3 py-2.5 text-sm font-medium',
                      isActive ? 'bg-zinc-100 text-iris' : 'text-zinc-600',
                    ].join(' ')
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/lots/nouveau"
                onClick={() => setOpen(false)}
                className="af-btn af-btn-primary mt-2"
              >
                Nouveau lot
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-10 md:px-6 md:py-12">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-200 bg-zinc-100">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="text-sm text-zinc-500">
            AgroFlow · Mutualiser les volumes. Organiser les flux. Suivre les lots.
          </p>
          <p className="af-eyebrow text-zinc-400">Cursor × Devs Days 2026</p>
        </div>
      </footer>
    </div>
  )
}
