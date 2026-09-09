import { Link } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { EmptyState } from '../components/EmptyState';
import { Surface } from '../components/Surface';
import { useAppState } from '../state/useAppState';
import { formatKg } from '../utils/formatKg';
import type { Operation } from '../types/lot';

const OP_LABEL: Record<Operation['statut'], string> = {
  validee: 'Validée',
  planifiee: 'Planifiée',
  en_transit: 'En transport',
  arrivee: 'Arrivée',
};

export function OperationsPage() {
  const { state } = useAppState();

  return (
    <div className="space-y-4">
      <AppHeader title="Opérations" subtitle="Suivi des groupements validés." />
      {state.operations.length === 0 ? (
        <EmptyState
          title="Aucune opération"
          body="Validez un regroupement pour créer une opération de transport."
          to="/matching"
          cta="Voir les propositions"
        />
      ) : (
        <ul className="space-y-3">
          {state.operations.map((operation) => (
            <li key={operation.id}>
              <Link to={`/operations/${operation.id}`}>
                <Surface>
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-af-ink">#{operation.id}</p>
                    <span className="rounded-full bg-af-blue-soft px-3 py-1 text-xs font-bold text-af-blue">
                      {OP_LABEL[operation.statut]}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] text-af-muted">
                    {operation.lotIds.length} lots • {formatKg(operation.poidsTotalKg)}
                  </p>
                  <p className="mt-1 text-[13px] text-af-muted">
                    {operation.depart} → {operation.destination}
                  </p>
                  <p className="mt-3 text-xs font-bold text-af-green">Suivre →</p>
                </Surface>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
