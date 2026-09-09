import type { Alerte } from '../types/lot';

const tones: Record<Alerte['severite'], string> = {
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  vigilance: 'bg-orange-50 text-orange-900 border-orange-200',
  critique: 'bg-red-50 text-red-800 border-red-200',
};

export function AlertBadge({ alerte }: { alerte: Alerte }) {
  return (
    <div className={`rounded-md border px-3 py-2 text-sm ${tones[alerte.severite]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{alerte.severite}</p>
      <p>{alerte.message}</p>
    </div>
  );
}
