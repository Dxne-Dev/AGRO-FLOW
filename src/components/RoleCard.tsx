import type { Role } from '../auth/types';
import {
  Leaf,
  Package,
  Truck,
  UserCheck,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

export type RoleCardTheme = {
  glow: string;
  glowBlur: string;
  statusDot: string;
  statusText: string;
  accentSoft: string;
  accentText: string;
  icon: LucideIcon;
  tagline: string;
};

export const ROLE_CARD_THEME: Record<Role, RoleCardTheme> = {
  producteur: {
    glow: 'bg-lime-400/90',
    glowBlur: 'shadow-[0_32px_64px_-16px_rgba(163,230,53,0.65)]',
    statusDot: 'bg-lime-500',
    statusText: 'Lots à déclarer',
    accentSoft: 'bg-af-green-soft',
    accentText: 'text-af-green-dark',
    icon: Warehouse,
    tagline: 'Déclarer et regrouper vos volumes',
  },
  transporteur: {
    glow: 'bg-sky-400/90',
    glowBlur: 'shadow-[0_32px_64px_-16px_rgba(56,189,248,0.55)]',
    statusDot: 'bg-sky-500',
    statusText: 'Opérations en cours',
    accentSoft: 'bg-af-blue-soft',
    accentText: 'text-af-blue',
    icon: Truck,
    tagline: 'Suivre volumes et trajets',
  },
  acheteur: {
    glow: 'bg-amber-400/90',
    glowBlur: 'shadow-[0_32px_64px_-16px_rgba(251,191,36,0.55)]',
    statusDot: 'bg-amber-500',
    statusText: 'Traçabilité des lots',
    accentSoft: 'bg-amber-50',
    accentText: 'text-amber-700',
    icon: Package,
    tagline: 'Consulter le passeport numérique',
  },
  operateur: {
    glow: 'bg-violet-400/90',
    glowBlur: 'shadow-[0_32px_64px_-16px_rgba(167,139,250,0.55)]',
    statusDot: 'bg-violet-500',
    statusText: 'Coordination des flux',
    accentSoft: 'bg-violet-50',
    accentText: 'text-violet-700',
    icon: UserCheck,
    tagline: 'Grouper, valider, alerter',
  },
};

type RoleCardProps = {
  label: string;
  displayName: string;
  description: string;
  role: Role;
  onSelect: () => void;
  index?: number;
};

export function RoleCard({
  label,
  displayName,
  description,
  role,
  onSelect,
  index = 0,
}: RoleCardProps) {
  const theme = ROLE_CARD_THEME[role];
  const Icon = theme.icon;

  return (
    <li
      className="af-role-card relative w-full list-none"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        className={`pointer-events-none absolute inset-x-4 top-[88%] bottom-[-1.75rem] z-0 rounded-[28px] ${theme.glow} ${theme.glowBlur}`}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 -bottom-8 z-0 flex items-center justify-center gap-1.5 py-2 text-center text-[11px] font-bold text-af-ink/80">
        <Leaf className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
        <span>{theme.tagline}</span>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="relative z-10 flex w-full flex-col overflow-visible rounded-[20px] border border-black/10 border-b-transparent bg-white/70 p-5 text-left shadow-lg shadow-black/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-black/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-af-green active:translate-y-0 sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between text-[12px] text-af-muted">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block size-2.5 animate-pulse rounded-full ${theme.statusDot}`}
              aria-hidden
            />
            <span>{theme.statusText}</span>
          </div>
          <span className="font-mono text-[11px] tracking-wide uppercase opacity-70">
            {role.slice(0, 3)}
          </span>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`flex size-28 items-center justify-center overflow-hidden rounded-[20px] ring-2 ring-black/5 sm:size-32 ${theme.accentSoft}`}
          >
            <Icon
              className={`size-14 sm:size-16 ${theme.accentText}`}
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-tight text-af-ink sm:text-2xl">
              {label}
            </h2>
            <p className="mt-1 text-xs text-af-muted">{displayName}</p>
            <p className="mt-2 text-sm leading-snug text-af-muted">{description}</p>
          </div>
        </div>

        <span
          className={`mt-6 flex h-12 w-full items-center justify-center rounded-2xl border border-black/5 text-sm font-bold ${theme.accentSoft} ${theme.accentText}`}
        >
          Continuer
        </span>
      </button>
    </li>
  );
}
