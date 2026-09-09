import { ArrowLeftRight, Home, Layers, LayoutGrid, Package, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { canAccess } from '../auth/types';

const tabs = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/lots', label: 'Lots', icon: Package },
  { to: '/matching', label: 'Match.', icon: ArrowLeftRight },
  { to: '/grouping', label: 'Grouper', icon: Layers },
  { to: '/operations', label: 'Opér.', icon: LayoutGrid },
  { to: '/profil', label: 'Profil', icon: User },
] as const;

function useVisibleTabs() {
  const { session } = useAuth();
  if (!session) return [];
  return tabs.filter((tab) => canAccess(session.role, tab.to));
}

export function BottomNav() {
  const visible = useVisibleTabs();
  if (visible.length === 0) return null;

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul
        className="grid px-1 pt-2 pb-2"
        style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}
      >
        {visible.map((tab) => {
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={'end' in tab ? tab.end : false}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 text-[10px] font-bold ${
                    isActive ? 'text-af-green' : 'text-af-muted'
                  }`
                }
              >
                <Icon className="h-[17px] w-[17px]" aria-hidden />
                {tab.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const { session } = useAuth();
  const visible = useVisibleTabs();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-black/5 bg-white md:flex md:flex-col">
      <div className="px-5 py-6">
        <p className="text-sm font-bold tracking-wide text-af-green">AGROFLOW</p>
        <p className="mt-1 text-xs text-af-muted">Lots, flux, passeport</p>
        {session ? (
          <p className="mt-3 text-[11px] font-bold text-af-ink">
            {session.displayName}
            <span className="mt-0.5 block font-normal text-af-muted capitalize">
              {session.role.replace('_', ' ')}
            </span>
          </p>
        ) : null}
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Principal">
        {visible.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={'end' in tab ? tab.end : false}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                  isActive ? 'bg-af-green-soft text-af-green' : 'text-af-muted hover:bg-af-canvas'
                }`
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              {tab.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
