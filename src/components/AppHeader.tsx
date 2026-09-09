import type { ReactNode } from 'react';
import { MoreHorizontal, RotateCcw } from 'lucide-react';
import { useAppState } from '../state/useAppState';

export function AppHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  const { resetDemo } = useAppState();

  return (
    <header className="flex items-start justify-between gap-4 pb-4">
      <div>
        <p className="text-base font-bold tracking-wide text-af-green">AGROFLOW</p>
        <h1 className="mt-1 text-xl font-bold text-af-ink">{title}</h1>
        {subtitle ? <div className="mt-2 text-[13px] text-af-muted">{subtitle}</div> : null}
      </div>
      <details className="relative">
        <summary
          className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-af-muted hover:bg-white"
          aria-label="Menu"
        >
          <MoreHorizontal className="h-5 w-5" aria-hidden />
        </summary>
        <div className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-black/5 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={resetDemo}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-af-ink hover:bg-af-canvas"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Charger les données de démonstration
          </button>
        </div>
      </details>
    </header>
  );
}
