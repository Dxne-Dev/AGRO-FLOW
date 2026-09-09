import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { EmptyState } from '../components/EmptyState';
import { Eyebrow, Surface } from '../components/Surface';
import { proposalsForReference } from '../services/grouping';
import { useAuth } from '../auth/AuthContext';
import { useAppState } from '../state/useAppState';
import { formatDisponibilite } from '../utils/formatDate';
import { formatKg } from '../utils/formatKg';
import { ProposalCard } from './matching/ProposalCard';

export function MatchingPage() {
  const { state } = useAppState();
  const { session } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const disponibles = state.lots.filter((lot) => lot.statut === 'disponible');
  const producerName = session?.displayName;

  const reference = useMemo(() => {
    const requested = params.get('ref');
    return (
      disponibles.find((lot) => lot.id === requested) ??
      (producerName
        ? disponibles.find((lot) => lot.producteur === producerName)
        : undefined) ??
      disponibles[0]
    );
  }, [disponibles, params, producerName]);

  const proposals = useMemo(
    () => (reference ? proposalsForReference(state.lots, reference.id) : []),
    [reference, state.lots],
  );

  if (!reference) {
    return (
      <div className="space-y-4">
        <AppHeader
          title="Regroupements trouvés"
          subtitle="Aucun lot disponible pour lancer un matching."
        />
        <EmptyState
          title="Aucun lot disponible"
          body="Créez un lot pour lancer l’analyse de compatibilité."
          to="/lots/nouveau"
          cta="Nouveau lot"
        />
      </div>
    );
  }

  const countLabel =
    proposals.length === 1 ? '1 possibilité' : `${proposals.length} possibilités`;

  return (
    <div className="space-y-4">
      <AppHeader
        title="Regroupements trouvés"
        subtitle={
          <label>
            Pour le lot{' '}
            <select
              className="bg-transparent font-normal text-af-muted underline decoration-black/10 underline-offset-2"
              value={reference.id}
              aria-label="Lot de référence"
              onChange={(event) => {
                navigate(`/matching?ref=${event.target.value}`, { replace: true });
              }}
            >
              {disponibles.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.id}
                </option>
              ))}
            </select>
          </label>
        }
      />

      <Surface>
        <Eyebrow>Votre lot</Eyebrow>
        <p className="mt-2 text-base font-bold text-af-ink">
          {reference.produit} • {formatKg(reference.quantiteKg)}
        </p>
        <p className="mt-1 text-[13px] text-af-muted">
          {reference.localisation} → {reference.destination}
        </p>
        <p className="mt-1 text-xs text-af-muted">
          {formatDisponibilite(reference.dateDisponibilite)}
        </p>
      </Surface>

      <h2 className="text-base font-bold text-af-ink">{countLabel}</h2>

      {proposals.length === 0 ? (
        <EmptyState
          title="Aucune possibilité"
          body="Aucun autre lot disponible n’est assez compatible avec celui-ci."
          to="/lots/nouveau"
          cta="Nouveau lot"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.lots.map((lot) => lot.id).join('-')}
              referenceId={reference.id}
              lots={proposal.lots}
              score={proposal.score}
            />
          ))}
        </div>
      )}
    </div>
  );
}
