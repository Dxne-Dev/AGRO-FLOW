import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { EmptyState } from '../components/EmptyState';
import { Surface } from '../components/Surface';
import { scoreBadgeLabel } from '../services/compatibility';
import { createOperationInput, groupingCriteria, groupingScore, isGroupEligible } from '../services/grouping';
import { nextOperationId } from '../services/ids';
import { useAppState } from '../state/useAppState';
import { formatKg } from '../utils/formatKg';
import { PrimaryButton } from './new-lot/fields';

const BADGE: Record<ReturnType<typeof scoreBadgeLabel>, string> = {
  haute: 'Forte compatibilité',
  moyenne: 'Compatibilité moyenne',
  faible: 'Faible compatibilité',
};

const CAPACITY_KG = 1000;

export function GroupingPage() {
  const { state, dispatch } = useAppState();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ids = (params.get('lots') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  const lots = ids
    .map((id) => state.lots.find((lot) => lot.id === id))
    .filter((lot): lot is NonNullable<typeof lot> => Boolean(lot));

  const eligible = useMemo(() => isGroupEligible(lots), [lots]);
  const score = lots.length >= 2 ? groupingScore(lots) : 0;
  const input = lots.length >= 2 ? createOperationInput(lots) : null;
  const criteria = groupingCriteria(lots);
  const overCapacity = Boolean(input && input.poidsTotalKg > CAPACITY_KG);
  const matchingHref = `/matching${lots[0] ? `?ref=${lots[0].id}` : ''}`;

  function create() {
    if (!eligible) return;
    const createdId = nextOperationId(state.operations);
    dispatch({ type: 'createOperation', lotIds: lots.map((lot) => lot.id) });
    navigate(`/operations/${createdId}`);
  }

  if (lots.length < 2) {
    return (
      <div className="space-y-4">
        <AppHeader
          title="Proposition"
          subtitle="Choisissez au moins deux lots depuis le matching."
        />
        <EmptyState
          title="Sélection insuffisante"
          body="Choisissez au moins deux lots compatibles depuis le matching."
          to="/matching"
          cta="Aller au matching"
        />
      </div>
    );
  }

  const reasons = [
    { ok: criteria.sameProduct, label: 'Même produit' },
    { ok: criteria.sameDestination, label: 'Même destination' },
    { ok: criteria.datesCompatible, label: 'Dates compatibles' },
    { ok: !overCapacity, label: 'Capacité suffisante' },
  ];

  return (
    <div className="space-y-4">
      <AppHeader title="Proposition" subtitle="Regroupement recommandé" />

      <span className="inline-flex rounded-full bg-af-green-soft px-3 py-1.5 text-[12px] font-bold text-af-green-dark uppercase">
        {BADGE[scoreBadgeLabel(score)]} • {score}%
      </span>

      <div>
        <p className="text-2xl font-bold text-af-ink">{lots.length} lots</p>
        <p className="mt-1 text-[13px] text-af-muted">
          {input ? formatKg(input.poidsTotalKg) : ''} mutualisés
        </p>
      </div>

      <Surface>
        <ul>
          {lots.map((lot, index) => (
            <li
              key={lot.id}
              className={`flex items-baseline justify-between gap-3 ${
                index > 0 ? 'mt-4' : ''
              }`}
            >
              <span className="text-sm font-bold text-af-ink">{lot.id}</span>
              <span className="text-[13px] text-af-muted">{formatKg(lot.quantiteKg)}</span>
            </li>
          ))}
        </ul>
      </Surface>

      <div>
        <h2 className="text-[15px] font-bold text-af-ink">Pourquoi cette proposition ?</h2>
        <ul className="mt-3 space-y-2.5" aria-label="Justification">
          {reasons.map((reason) => (
            <li
              key={reason.label}
              className={`text-[13px] ${reason.ok ? 'text-af-green-dark' : 'text-af-muted'}`}
            >
              {reason.ok ? '✓' : '–'} {reason.label}
            </li>
          ))}
        </ul>
      </div>

      {!eligible ? (
        <p
          role="alert"
          className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          Regroupement refusé : contraintes produit incompatibles
        </p>
      ) : null}
      {eligible && overCapacity ? (
        <p
          role="status"
          className="rounded-[20px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900"
        >
          Volume proche de la capacité maximale
        </p>
      ) : null}

      <div className="space-y-3 pt-1">
        <PrimaryButton type="button" disabled={!eligible} onClick={create}>
          Accepter le regroupement
        </PrimaryButton>
        <Link
          to={matchingHref}
          className="flex h-12 items-center justify-center rounded-2xl border border-af-green bg-white text-sm font-bold tracking-wide text-af-green uppercase hover:bg-af-green-soft"
        >
          Refuser
        </Link>
      </div>
    </div>
  );
}
