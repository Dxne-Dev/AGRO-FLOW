import { scoreBadgeLabel } from '../services/compatibility';

const labels = {
  haute: 'Haute compatibilité',
  moyenne: 'Compatibilité moyenne',
  faible: 'Faible',
};

const tones = {
  haute: 'bg-emerald-600',
  moyenne: 'bg-orange-500',
  faible: 'bg-stone-400',
};

const badgeTones = {
  haute: 'bg-emerald-50 text-emerald-800',
  moyenne: 'bg-orange-50 text-orange-800',
  faible: 'bg-stone-100 text-stone-600',
};

export function ScoreBar({
  score,
  animated = false,
}: {
  score: number;
  animated?: boolean;
}) {
  const level = scoreBadgeLabel(score);
  const width = Math.min(100, Math.max(0, score));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeTones[level]}`}
        >
          {labels[level]}
        </span>
        <span className="text-sm font-semibold tabular-nums">{score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-200">
        <div
          className={`h-full origin-left ${tones[level]} ${animated ? 'animate-[grow_0.7s_ease-out]' : ''}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
