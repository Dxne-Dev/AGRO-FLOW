import type { Lot } from '../types/lot';
import { formatKg } from '../utils/formatKg';
import { ScoreBar } from './ScoreBar';

export function LotCard({
  lot,
  score,
  selected,
  onToggle,
  animatedScore,
}: {
  lot: Lot;
  score?: number;
  selected?: boolean;
  onToggle?: () => void;
  animatedScore?: boolean;
}) {
  const clickable = Boolean(onToggle);

  return (
    <article
      className={`rounded-lg border bg-white p-4 shadow-sm ${
        selected ? 'border-emerald-500 ring-1 ring-emerald-200' : 'border-stone-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-stone-500">{lot.id}</p>
          <h3 className="text-lg font-semibold text-stone-900">{lot.produit}</h3>
          <p className="text-sm text-stone-600">{lot.producteur}</p>
        </div>
        <p className="text-sm font-medium text-emerald-800">{formatKg(lot.quantiteKg)}</p>
      </div>
      <p className="mt-3 text-sm text-stone-700">
        {lot.localisation} → {lot.destination}
      </p>
      <p className="text-xs text-stone-500">Statut : {lot.statut.replaceAll('_', ' ')}</p>
      {score !== undefined ? (
        <div className="mt-3">
          <ScoreBar score={score} animated={animatedScore} />
        </div>
      ) : null}
      {clickable ? (
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(selected)}
            onChange={onToggle}
            className="h-4 w-4 rounded border-stone-300 text-emerald-600"
          />
          Inclure dans le groupement
        </label>
      ) : null}
    </article>
  );
}
