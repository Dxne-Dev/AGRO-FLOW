import { Link } from 'react-router-dom';
import { Surface } from '../../components/Surface';
import { groupingCriteria } from '../../services/grouping';
import { scoreBadgeLabel } from '../../services/compatibility';
import { formatKg } from '../../utils/formatKg';
import type { Lot } from '../../types/lot';

const BADGE: Record<ReturnType<typeof scoreBadgeLabel>, string> = {
  haute: 'Forte compatibilité',
  moyenne: 'Compatibilité moyenne',
  faible: 'Faible compatibilité',
};

const CHECKS: { key: keyof ReturnType<typeof groupingCriteria>; label: string }[] = [
  { key: 'sameProduct', label: 'Même produit' },
  { key: 'sameDestination', label: 'Même destination' },
  { key: 'datesCompatible', label: 'Dates compatibles' },
  { key: 'zoneCompatible', label: 'Zone de collecte compatible' },
];

export function ProposalCard({
  referenceId,
  lots,
  score,
}: {
  referenceId: string;
  lots: Lot[];
  score: number;
}) {
  const partners = lots.filter((lot) => lot.id !== referenceId);
  const volume = lots.reduce((sum, lot) => sum + lot.quantiteKg, 0);
  const criteria = groupingCriteria(lots);
  const level = scoreBadgeLabel(score);
  const href = `/grouping?lots=${lots.map((lot) => lot.id).join(',')}`;

  return (
    <Surface>
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-af-green-soft px-3 py-1.5 text-center text-[12px] font-bold text-af-green-dark uppercase">
          {BADGE[level]}
        </span>
        <p className="text-lg font-bold text-af-green tabular-nums">{score}%</p>
      </div>

      <p className="mt-4 text-[11px] font-bold text-af-muted">Lots compatibles</p>
      <ul className="mt-2 space-y-2">
        {partners.map((lot) => (
          <li key={lot.id} className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-bold text-af-ink">{lot.id}</span>
            <span className="text-[13px] text-af-muted">{formatKg(lot.quantiteKg)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-black/5 pt-4">
        <p className="text-xs font-bold text-af-muted">Volume mutualisé</p>
        <p className="mt-1 text-base font-bold text-af-ink">{formatKg(volume)}</p>
      </div>

      <ul className="mt-4 space-y-2.5" aria-label="Critères de compatibilité">
        {CHECKS.map(({ key, label }) => {
          const ok = criteria[key];
          return (
            <li
              key={key}
              className={`text-[13px] ${ok ? 'text-af-green-dark' : 'text-af-muted'}`}
            >
              {ok ? '✓' : '–'} {label}
            </li>
          );
        })}
      </ul>

      <Link
        to={href}
        className="mt-5 flex h-12 items-center justify-center rounded-2xl bg-af-green text-sm font-bold tracking-wide text-white uppercase hover:bg-af-green-dark"
      >
        Voir le regroupement
      </Link>
    </Surface>
  );
}
