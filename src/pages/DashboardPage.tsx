import { Link } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { AlertBadge } from '../components/AlertBadge';
import { CorridorFlow } from '../components/CorridorFlow';
import { EmptyState } from '../components/EmptyState';
import { Eyebrow, Surface } from '../components/Surface';
import { useAuth } from '../auth/AuthContext';
import { canAccess } from '../auth/types';
import { largestEligibleCluster } from '../services/grouping';
import { checkAlerts } from '../services/rulesEngine';
import { useAppState } from '../state/useAppState';
import { formatKg } from '../utils/formatKg';
import type { Operation } from '../types/lot';

const OP_LABEL: Record<Operation['statut'], string> = {
  validee: 'Validée',
  planifiee: 'Planifiée',
  en_transit: 'En transport',
  arrivee: 'Arrivée',
};

export function DashboardPage() {
  const { state } = useAppState();
  const { session } = useAuth();
  const pending = state.lots.filter((lot) => lot.statut === 'disponible').length;
  const cluster = largestEligibleCluster(state.lots);
  const activeOp = [...state.operations]
    .reverse()
    .find((op) => op.statut !== 'arrivee');
  const alerts = state.operations.flatMap((operation) =>
    checkAlerts({
      operation,
      lots: state.lots,
      evenements: state.evenements,
      now: new Date(),
    }),
  );

  const clusterKg = cluster?.reduce((sum, lot) => sum + lot.quantiteKg, 0) ?? 0;
  const clusterRef = cluster?.[0];
  const role = session?.role;
  const showLots = role ? canAccess(role, '/lots') : false;
  const showGrouping = role ? canAccess(role, '/grouping') : false;
  const showNewLot = role ? canAccess(role, '/lots/nouveau') : false;
  const showOperations = role ? canAccess(role, '/operations') : false;
  const showMatching = role ? canAccess(role, '/matching') : false;
  const isAcheteur = role === 'acheteur';

  return (
    <div className="space-y-4">
      <AppHeader
        title={session ? `Bonjour, ${session.displayName}` : 'Bonjour !'}
        subtitle="Voici l’état de vos lots et opérations."
      />

      {isAcheteur ? (
        <Surface>
          <Eyebrow>Passeport</Eyebrow>
          <p className="mt-2 text-sm text-af-muted">
            Scannez un QR ou ouvrez un passeport de démo pour vérifier le trajet.
          </p>
          <Link
            to="/passport/AF-001"
            className="mt-3 inline-block text-sm font-bold text-af-blue hover:underline"
          >
            Ouvrir AF-001 →
          </Link>
        </Surface>
      ) : null}
      {showLots ? (
      <Surface>
        <Eyebrow>Mes lots</Eyebrow>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-[28px] leading-none font-bold text-af-ink">
            {state.lots.length}{' '}
            <span className="text-[13px] font-normal text-af-muted">lots</span>
          </p>
          <p className="text-[28px] leading-none font-bold text-af-ink">
            {pending}{' '}
            <span className="text-[13px] font-normal text-af-muted">en attente</span>
          </p>
        </div>
      </Surface>
      ) : null}

      {showLots ? (
      <Surface>
        <Eyebrow>Regroupements disponibles</Eyebrow>
        {cluster && clusterRef ? (
          <>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-bold text-af-ink">
                  {clusterRef.produit} • {formatKg(clusterKg)}
                </p>
                <p className="mt-1 text-[13px] text-af-muted">
                  {clusterRef.localisation} → {clusterRef.destination}
                </p>
              </div>
              <span className="rounded-full bg-af-green-soft px-3 py-1.5 text-center text-xs font-bold text-af-green-dark">
                {cluster.length} trouvés
              </span>
            </div>
            {showGrouping ? (
              <Link
                to={`/grouping?lots=${cluster.map((lot) => lot.id).join(',')}`}
                className="mt-3 inline-block text-xs font-bold text-af-green hover:underline"
              >
                Voir les propositions →
              </Link>
            ) : showMatching ? (
              <Link
                to="/matching"
                className="mt-3 inline-block text-xs font-bold text-af-green hover:underline"
              >
                Voir le matching →
              </Link>
            ) : null}
          </>
        ) : (
          <p className="mt-3 text-[13px] text-af-muted">
            Aucun regroupement éligible pour le moment.
          </p>
        )}
      </Surface>
      ) : null}

      {showNewLot ? (
      <Link
        to="/lots/nouveau"
        className="flex h-12 items-center justify-center rounded-2xl bg-af-green text-sm font-bold tracking-wide text-white uppercase hover:bg-af-green-dark"
      >
        + Créer un lot
      </Link>
      ) : null}

      {showOperations ? (
      <Surface>
        <Eyebrow>Opération en cours</Eyebrow>
        {activeOp ? (
          <>
            <div className="mt-3 flex items-start justify-between gap-3">
              <p className="text-base font-bold text-af-ink">#{activeOp.id}</p>
              <span className="rounded-full bg-af-blue-soft px-3 py-1.5 text-center text-xs font-bold text-af-blue">
                {OP_LABEL[activeOp.statut]}
              </span>
            </div>
            <p className="mt-2 text-[13px] text-af-muted">
              {activeOp.lotIds.length} lots • {formatKg(activeOp.poidsTotalKg)}
            </p>
            <p className="mt-1 text-[13px] text-af-muted">
              {activeOp.depart} → {activeOp.destination}
            </p>
            <Link
              to={`/operations/${activeOp.id}`}
              className="mt-3 inline-block text-xs font-bold text-af-green hover:underline"
            >
              Suivre l’opération →
            </Link>
          </>
        ) : (
          <p className="mt-3 text-[13px] text-af-muted">
            Aucune opération en cours. Créez un regroupement pour démarrer le suivi.
          </p>
        )}
      </Surface>
      ) : null}

      {showOperations || showMatching ? (
      <section className="space-y-3 pt-2">
        <h2 className="text-base font-bold text-af-ink">Alertes</h2>
        {alerts.length === 0 ? (
          <EmptyState
            title="Aucune alerte"
            body="Les règles de vigilance n’ont rien à signaler pour le moment."
            to={showMatching ? '/matching' : '/operations'}
            cta={showMatching ? 'Voir le matching' : 'Voir les opérations'}
          />
        ) : (
          <ul className="space-y-2">
            {alerts.map((alerte) => (
              <li key={alerte.id}>
                <Link to={`/operations/${alerte.sourceId}`}>
                  <AlertBadge alerte={alerte} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      ) : null}

      {!isAcheteur ? (
      <section className="hidden rounded-[20px] border border-black/5 bg-white p-5 lg:block">
        <Eyebrow>Corridor Sud</Eyebrow>
        <CorridorFlow />
      </section>
      ) : null}
    </div>
  );
}
